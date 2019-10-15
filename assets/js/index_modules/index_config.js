/* eslint-disable require-jsdoc */
const configInitializer = () => {
  let uniqueConfigInstance = null;

  class Config {
    constructor(configs) {
      if (!uniqueConfigInstance) {
        uniqueConfigInstance = this;
        this.d3Configs = {
          svgSize: {
            height: 400,
            width: 600,
          },
          tooltips: {
            xDiference: 20,
            yBase: -1,
            viewport: 20,
            padding: 4,
            vectorRadius: 30,
            timeLapse: 1000,
          },
          nodes: {
            url: '/',
            input: {
              width: 20,
              height: 100,
            },
            layers: [
              'layer_0',
              'layer_7',
              'layer_15',
              'layer_31',
            ],
            result_length: 3,
          },
        };
        this.d3Configs = Object.assign(this.d3Configs, configs);
        this.updateConfig = this.updateConfig.bind(this);
      }
      return uniqueConfigInstance;
    }

    updateConfig(options, target) {
      this['target'] = Object.assign(this[target], options);
    }
  }
  return Config;
};

const Config = configInitializer();
let config = new Config({});
const testConfig = new Config({});

if (config !== testConfig) {
  // eslint-disable-next-line no-throw-literal
  throw 'Singleton violation';
};

config = config;