import G6 from '@antv/g6';

G6.registerNode(
  'dom-node',
  {
    draw: (cfg, group) => {
      const stroke = cfg.style ? cfg.style.stroke || '#5B8FF9' : '#5B8FF9';
      const shape = group.addShape('dom', {
        attrs: {
          width: cfg.size[0],
          height: 30,
          html: `
            <div onmcontextmenu="handleMenuClick(cfg);" style="background-color: #fff; border: 2px solid #5B8FF9; border-radius: 5px; width: 70px; height: 30px; display: flex;">
              <div style="height: 100%; width: 33%; background-color: #CDDDFD">
                <img alt="img" style="line-height: 100%; padding-top: 6px; padding-left: 8px;" 
                  src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Q_FQT6nwEC8AAAAAAAAAAABkARQnAQ" 
                  width=${cfg.icon.width} 
                  height=${cfg.icon.height}
                />  
              </div>
              <span style="margin:auto; padding:auto; color: #5B8FF9">${cfg.label}</span>
            </div>
            `,
        },
        // name: 'dom-shape',
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

G6.registerBehavior('custemBehavior', {
  getEvents() {
    return {
      'node:click': 'onNodeClick',
      'edge:click': 'onEdgeClick',
      mousemove: 'onMouseMove',
    };
  },
  onNodeClick(evt) {
    // TODO
    console.log(evt)
  },
  onEdgeClick(evt) {
    // TODO
  },
  onMouseMove(evt) {
    // TODO
  },
});