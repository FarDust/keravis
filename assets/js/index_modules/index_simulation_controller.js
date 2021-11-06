/* eslint-disable require-jsdoc */

// eslint-disable-next-line no-unused-vars
class SimulationController {
  constructor(timeStep=1000) {
    this.subscribers = [];
    this.timestep = timeStep;
  }

  startSimulation() {
    setInterval(() => {
      this.notifyTimeStep();
    }, this.timestep);
  }

  notifyTimeStep() {
    this.subscribers.forEach((idiom) => {
      idiom.nextSimulationStep();
    });
  }

  subcribeIdiom(idiom) {
    this.subscribers.push(idiom);
  }
}
