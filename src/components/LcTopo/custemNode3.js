import G6 from '@antv/g6';

G6.registerNode(
  'cust-node',
  {
    draw(cfg, group) {
      const keyShape = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width: 70,
          height: 70,
          lineWidth: 2,
          cursor: 'move',
          stroke: cfg.style.stroke
        },
      });

      group.addShape('image', {
        attrs: {
          x: 21,
          y: 8,
          width: 27,
          height: 27,
          img: cfg.icon.img,
        },
      });

      group.addShape('text', {
        attrs: {
          text: cfg.label,
          x: 0,
          y: 90,
          fontSize: 12,
          fill: '#333',
        },
      });

      return keyShape;
    },
  },
  'single-node',
);