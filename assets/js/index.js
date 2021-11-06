const createIdioms = (dataLinks) => {
  const idiom2 = new Idiom2(
      dataLinks[0],
      '#game'
  );
  const idiom3 = new Idiom3(
      dataLinks[1],
      '#network'
  );
  idiom2.initilize();
  idiom3.initilize();
  idiom3.setSimulation();

  simulation = new SimulationController(60);
  simulation.subcribeIdiom(idiom2);
  simulation.subcribeIdiom(idiom3);
  simulation.startSimulation();
};

fetch(
    '/data_manifest'
).then((response) => response.json())
    .then((data) => createIdioms(data));
