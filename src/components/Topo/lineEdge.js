import G6 from '@antv/g6';


// lineDash 的差值，可以在后面提供 util 方法自动计算
const dashArray = [
  [ 0, 1 ],
  [ 0, 2 ],
  [ 1, 2 ],
  [ 0, 1, 1, 2 ],
  [ 0, 2, 1, 2 ],
  [ 1, 2, 1, 2 ],
  [ 2, 2, 1, 2 ],
  [ 3, 2, 1, 2 ],
  [ 4, 2, 1, 2 ]
];
const lineDash = [ 4, 2, 1, 2 ];
const interval = 9; // 频率

G6.registerEdge('line-running', {
  setState(name, value, item) {
    const shape = item.get('keyShape');
    if (name === 'running' && shape) {
      if (value) {
        const length = shape.getTotalLength(); // 后续 G 增加 totalLength 的接口
        let totalArray = [];
        for (let i = 0; i < length; i += interval) {
          totalArray = totalArray.concat(lineDash);
        }
        let index = 0;
        shape.attr('stroke', '#4fa2de');
        shape.animate({
          onFrame() {
            const cfg = {
              lineDash: dashArray[index].concat(totalArray)
            };
            index = (index + 1) % interval;
            return cfg;
          },
          repeat: true
        }, 3000);
      } else {
        shape.stopAnimate();
        shape.attr('lineDash', null);
        shape.attr('stroke', '#ccc');
      }
    }
  }
}, 'line');
