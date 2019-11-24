'use strict';
/* eslint-disable require-jsdoc */

class Idiom2 extends Idiom {
  constructor(source, selector) {
    super(source, selector);
    this.data;
    this.state = {
    };
  }

  initilize() {
    if (!this.initilized) {
      super.initilize();
      const textPadding = 5;
      const numberEstimatedLength = 30;
      this.svgSelector
          .append('rect')
          .attr('width', config.d3Configs.svgSize.width)
          .attr('height', config.d3Configs.svgSize.height)
          .attr('fill', '#efefef');
      this.setState('snake',
          this.svgSelector.append('g').attr('name', 'snake'));
      this.setState('score',
          this.svgSelector
              .raise()
              .append('g').attr('name', 'score')
              .attr('transform', `translate(${20} , ${20} )`)
      );
      this.state.score.append('rect').attr('name', 'display')
          .attr('width', 200)
          .attr('height', 40)
          .attr('fill', 'rgba(50,50,50,0.2)');
      const scoreText = this.state.score.append('text')
          .text('Score: ')
          .attr('transform', `translate(${20} , ${20} )`);
      const scoreTextWidth = scoreText.node().getBBox()['width'];
      const roundText = this.state.score.append('text')
          .text('Round: ')
          .attr('transform', `translate(${20 + scoreTextWidth + 5 + 30} , ${20} )`);
      const roundTextWidth = roundText.node().getBBox()['width'];
      this.setState('currentScore', this.state.score
          .append('text')
          .text('0')
          .attr('transform', `translate(${20 + scoreTextWidth + 5} , ${20} )`)
      );
      this.setState('currentRound', this.state.score
          .append('text')
          .text('No data!')
          .attr('transform', `translate(${20 + scoreTextWidth + 5 + 30 + roundTextWidth + 5} , ${20} )`)
      );
      this.initilized = true;
    }
  }

  getData() {
    super.getData().then(() => {
      this.state.currentRound.text(this.data.round);
    });
  }

  nextSimulationStep(index) {
    const simulation = this.data.history[index];
    this.state.snake.append('g').attr('name', 'snake-path')
        .selectAll('circle')
        .data([simulation])
        .enter()
        .append('circle')
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y)
        .attr('r', config.d3Configs.snake.snakeRadius)
        .classed('snake', true);
    this.state.currentScore.text(index);
  }
}
