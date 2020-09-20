import G6 from '@antv/g6';

G6.registerNode(
  'rect-jsx',
  (cfg) => {
    console.log(cfg.style.stroke)
    return `
    <group>
      <rect 
        style={{
          width: 70,
          height: 70,
          radius: [6, 6, 6, 6],
          fill: '#fff',
          stroke: ${cfg.style.stroke}
        }} 
        draggable="true" 
      >
        <image style={{ img: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png', display: 'block',  width: 27, height: 27, marginLeft: 22, marginTop: 20 }} />
        <image style={{ img: 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png', display: 'block',  width: 12, height: 12, marginLeft: 22, marginTop: 20 }} />
        <text style={{
        marginBottom: -20,
        textAlign: 'center',
        fontWeight: 'bold',
        fill: '#333'
      }}>${cfg.label}</text>
      </rect >
    </group>
    `
  }
);