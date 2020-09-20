import G6 from '@antv/g6';

G6.registerNode(
  'dom-node',
  {
    draw: (cfg, group) => {
      
      const shape = group.addShape('dom', {
        attrs: {
          width: cfg.size[0],
          height: 30,
          html: `
            <div id=${cfg.id} class="dom-node"
            style="background-color: #fff; border: 2px solid #5B8FF9; border-radius: 5px; width: 70px; height: 30px; display: flex; cursor: pointer;" >
              <span style="margin:auto; padding:auto; color: #5B8FF9">${cfg.label}</span>
            </div>
            `,
        },
        name: 'dom-shape',
        draggable: true,
      });
      if (cfg.name) {
        group.addShape('text', {
          attrs: {
            text: cfg.name,
            x: 0,
            y: 0,
            fill: '#00287E',
            fontSize: 14,
            textAlign: 'center',
            textBaseline: 'bottom',
            fontWeight: 'bold',
          },
          name: 'text-shape',
        });
      }
      return shape;
    },
  },
  'single-node',
);