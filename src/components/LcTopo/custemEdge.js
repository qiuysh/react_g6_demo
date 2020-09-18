import G6 from '@antv/g6';

G6.registerEdge('hvh', {
 draw(cfg, group) {
   const startPoint = cfg.startPoint;
   const endPoint = cfg.endPoint;
   const shape = group.addShape('path', {
     attrs: {
       stroke: '#333',
       path: [
         ['M', startPoint.x, startPoint.y],
         ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
         ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
         ['L', endPoint.x, endPoint.y],
       ],
     },
     // must be assigned in G6 3.3 and later versions. it can be any value you want
     name: 'path-shape',
   });
   return shape;
 },
});