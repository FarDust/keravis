/* eslint-disable require-jsdoc */

class SimulationController {
  constructor(simulationLength, timeStep=1000) {
    this.subscribers = [];
    this.indexArray = Array(simulationLength).fill().map((_, i) => i);
    this.timestep = timeStep;
  }

  startSimulation() {
    this.indexArray.forEach( (index) => {
      setTimeout(() => {
        this.notifyTimeStep(index);
        console.debug('executed');
      }, this.timestep*index);
    });
  }

  notifyTimeStep(index) {
    this.subscribers.forEach((idiom) => {
      idiom.nextSimulationStep(index);
    });
  }


  subcribeIdiom(idiom) {
    this.subscribers.push(idiom);
  }
}
