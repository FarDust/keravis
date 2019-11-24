const idiom2 = new Idiom2(
    '../game_data/game_0_15710788365377628.json',
    '#game'
);
const idiom3 = new Idiom3(
    '../logs/history/network-15710788366707638.json',
    '#network'
);
idiom2.initilize();
idiom3.initilize();
idiom3.setSimulation();

let simulation; // Only for console access

const initilizeSimulation = () => {
  d3.json('../logs/history/network-15710788366707638.json',
      function(error, data) {
        if (error) throw error;
      }).then(
      (data) => {
        simulation = new SimulationController(data.length, 30);
        simulation.subcribeIdiom(idiom2);
        simulation.subcribeIdiom(idiom3);
        simulation.startSimulation();
      }
  );
};

initilizeSimulation();

