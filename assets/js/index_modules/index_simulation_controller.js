/* eslint-disable require-jsdoc */

class SimulationController {
  constructor(timeStep=1000) {
    this.subscribers = [];
    this.timestep = timeStep;
  }

  startSimulation() {
    setInterval(() => {
      this.notifyTimeStep();
      console.debug('executed');
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
