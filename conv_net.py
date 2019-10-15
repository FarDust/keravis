import tensorflow as tf

ACTIONS = 3


def variable_summaries(var):
    """Attach a lot of summaries to a Tensor (for TensorBoard visualization)."""
    with tf.name_scope("summaries"):
        mean = tf.reduce_mean(var)
        tf.summary.scalar("mean", mean)
        with tf.name_scope("stddev"):
            stddev = tf.sqrt(tf.reduce_mean(tf.square(var - mean)))
        tf.summary.scalar("stddev", stddev)
        tf.summary.scalar("max", tf.reduce_max(var))
        tf.summary.scalar("min", tf.reduce_min(var))
        tf.summary.histogram("histogram", var)
    return var


def weight_variable(shape, name):
    initial = tf.truncated_normal(shape, stddev=0.01)
    return variable_summaries(tf.Variable(initial, name=name))


def bias_variable(shape, name):
    initial = tf.constant(0.01, shape=shape)
    return variable_summaries(tf.Variable(initial, name=name))


def conv2d(x, W, stride):
    return tf.nn.conv2d(x, W, strides=[1, stride, stride, 1], padding="SAME")


def max_pool_2x2(x):
    return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding="SAME")


def createGraph():
    # network weights
    W_conv1 = weight_variable([8, 8, 4, 32], "conv1_kernel")
    b_conv1 = bias_variable([32], "conv1_bias")

    W_conv2 = weight_variable([4, 4, 32, 64], "conv2_kernel")
    b_conv2 = bias_variable([64], "conv2_bias")

    W_conv3 = weight_variable([3, 3, 64, 64], "conv3_kernel")
    b_conv3 = bias_variable([64], "conv3_bias")

    W_fc1 = weight_variable([1600, 512], "fc1_kernel")
    b_fc1 = bias_variable([512], "fc1_bias")

    W_fc2 = weight_variable([512, ACTIONS], "fc2_kernel")
    b_fc2 = bias_variable([ACTIONS], "fc2_bias")

    # input layer
    s = tf.placeholder("float", [None, 80, 80, 4], name="input")

    # hidden layers
    tf.summary.histogram("input", s)
    h_conv1 = tf.nn.relu(conv2d(s, W_conv1, 4) + b_conv1, name="conv1")
    tf.summary.histogram("conv1", h_conv1)
    h_pool1 = max_pool_2x2(h_conv1)
    tf.summary.histogram("pool1", h_pool1)

    h_conv2 = tf.nn.relu(conv2d(h_pool1, W_conv2, 2) + b_conv2, name="conv2")
    tf.summary.histogram("conv2", h_conv2)
    h_conv3 = tf.nn.relu(conv2d(h_conv2, W_conv3, 1) + b_conv3, name="conv3")
    tf.summary.histogram("conv3", h_conv3)
    h_conv3_flat = tf.reshape(h_conv3, [-1, 1600])

    h_fc1 = tf.nn.relu(tf.matmul(h_conv3_flat, W_fc1) + b_fc1)

    # readout layer
    readout = tf.matmul(h_fc1, W_fc2) + b_fc2
    tf.summary.histogram("output", readout)

    return s, readout, h_fc1, h_conv1
