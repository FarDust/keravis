import pygame
from game import Game
import random
import numpy as np
from collections import deque
from conv_net import createGraph
import tensorflow as tf
import time
import json
import sys
from csv import DictWriter

ACTIONS = 3
INITIAL_ESPSILON = 1.0
FINAL_ESPSILON = 0.5
OBSERVE = 500.0
EXPLORE = 500.0
REPLAY_MEMORY = 50000
BATCH_SIZE = 32
LR = 1e-6
GAMMA = 0.99


def get_current_state(timestep):
    if timestep <= OBSERVE:
        return "observe"
    elif timestep > OBSERVE and timestep <= OBSERVE + EXPLORE:
        return "explore"
    else:
        return "train"


def trainNetwork(s, readout, h_fc1, h_conv1, sess):
    a = tf.placeholder("float", [None, ACTIONS])
    y = tf.placeholder("float", [None])
    readout_action = tf.reduce_sum(tf.multiply(readout, a), reduction_indices=1)
    cost = tf.reduce_mean(tf.square(y - readout_action))
    train_step = tf.train.AdamOptimizer(LR).minimize(cost)

    game = Game(640, 480)

    D = deque()

    do_nothing = np.zeros(ACTIONS)
    do_nothing[0] = 1
    x_t, r_0 = game.step(do_nothing)
    s_t = np.stack((x_t, x_t, x_t, x_t), axis=2)

    saver = tf.train.Saver()
    merged = tf.summary.merge_all()
    file_writer = tf.summary.FileWriter("./logs", sess.graph)
    sess.run(tf.initialize_all_variables())
    checkpoint = tf.train.get_checkpoint_state("saved_networks")
    if checkpoint and checkpoint.model_checkpoint_path:
        saver.restore(sess, checkpoint.model_checkpoint_path)
        print("Successfully loaded: ", checkpoint.model_checkpoint_path)
    else:
        print("No previous network weights found")

    with open("logs/log.csv", "a") as file:
        log_file = DictWriter(
            file, fieldnames=["timestamp", "score", "q_max", "epsilon"]
        )
        t = 0
        epsilon = INITIAL_ESPSILON
        game_network = list()
        while 1:
            events = pygame.event.get()
            for event in events:
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE:
                        sys.exit()
                        raise SystemExit

            readout_t = readout.eval(feed_dict={s: [s_t]})[0]
            result_conv_1 = h_conv1.eval(feed_dict={s: [s_t]})
            tf.summary.scalar("q", readout_t)
            a_t = np.zeros(ACTIONS)
            action_index = 0
            random_index = random.random()
            if random_index <= epsilon:
                print("This is a random action")
                action_index = random.randrange(ACTIONS)
                a_t[action_index] = 1
            else:
                action_index = np.argmax(readout_t)
                a_t[action_index] = 1

            if epsilon > FINAL_ESPSILON and t > OBSERVE:
                epsilon -= (INITIAL_ESPSILON - FINAL_ESPSILON) / EXPLORE

            x_t1, r_t = game.step(a_t)
            record = time.time()
            if r_t == -1:
                json.dump(
                    game_network.copy(),
                    open("logs/history/network-{}.json".format(int(record * 1e7)), "w"),
                )
                game_network = list()

            x_t1 = np.reshape(x_t1, (80, 80, 1))
            s_t1 = np.append(x_t1, s_t[:, :, :3], axis=2)

            D.append((s_t, a_t, r_t, s_t1))
            if len(D) > REPLAY_MEMORY:
                D.popleft()

            if t > OBSERVE:
                minibatch = random.sample(D, BATCH_SIZE)

                s_j_batch = [d[0] for d in minibatch]
                a_batch = [d[1] for d in minibatch]
                r_batch = [d[2] for d in minibatch]
                s_j1_batch = [d[3] for d in minibatch]

                y_batch = []
                readout_j1_batch = readout.eval(feed_dict={s: s_j1_batch})
                for i in range(0, len(minibatch)):
                    y_batch.append(r_batch[i] + GAMMA * np.max(readout_j1_batch[i]))

                summary, _ = sess.run(
                    [merged, train_step],
                    feed_dict={y: y_batch, a: a_batch, s: s_j_batch},
                )

            network = {
                "layer_0": result_conv_1[:, :, :, 0].tolist(),
                "layer_7": result_conv_1[:, :, :, 7].tolist(),
                "layer_15": result_conv_1[:, :, :, 15].tolist(),
                "layer_31": result_conv_1[:, :, :, 31].tolist(),
                "action": (
                    a_t.tolist() if random_index <= epsilon else readout_t.tolist()
                ),
                "score": int(game.latest_score),
                "q_max": float(np.max(readout_t)),
                "epsilon": float(epsilon),
                "timestep": int(t),
                "state": get_current_state(t),
                "reward": float(r_t),
                "timestampE7": int(record * 1e7),
            }
            game_network.append(network)
            s_t = s_t1
            t += 1

            # save progress every 10000 iterations
            if t % 1000 == 0:
                saver.save(sess, "saved_networks/curve-fever-dqn", global_step=t)
                file_writer.add_summary(summary, t // 1000)

            if t % 10 == 0:
                print(
                    "TIMESTEP {} | STATE {} | EPSILON {} | ACTION {} | REWARD {} | Q_MAX {}".format(
                        t,
                        get_current_state(t),
                        epsilon,
                        action_index,
                        r_t,
                        np.max(readout_t),
                    )
                )


def train():
    # import os
    # os.environ["SDL_VIDEODRIVER"] = "dummy"
    sess = tf.InteractiveSession()
    s, readout, h_fc1, h_conv1 = createGraph()
    trainNetwork(s, readout, h_fc1, h_conv1, sess)


if __name__ == "__main__":
    train()
