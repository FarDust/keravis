
class SimulationController {

  constructor(simulationLength, simulationTime=1000) {
    this.subscribers = [];
    this.simulationLength = simulationLength
    this.timestep = simulationTime;
  }

  startSimulation() {
     
    this.data.forEach( (game, index) => {
      setTimeout(() => {this.notifyTimeStep(index)}, this.timestep*index);
    });
  }
  }

  notifyTimeStep() {
    this.subscribers.forEach(idiom => {
      idiom.nextSimulationStep();
    });
  }


  subcribeIdiom(idiom) {
    this.subscribers.push(idiom);
  }
}