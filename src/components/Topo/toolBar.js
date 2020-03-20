
import React from 'react';
import { Tooltip, InputNumber } from 'antd';

/**
 * 半径设置
 * @param {*} props 
 */
export default function ToolBar(props) {
  const { handleChange, xR, yR } = props;
  return <div className="offset">
    <div className="item-tool">
      半径
      <Tooltip title={<div>
        水平半径，影响水平布局的大小。
        </div>
      }>
        &nbsp;
        <InputNumber size="small" 
          min={0}
          onChange={ e => handleChange('x', e)} 
          value={xR} 
        />
      </Tooltip>
    </div>&nbsp;&nbsp;&nbsp;:
    <div className="item-tool">
      <Tooltip title={<div>
        垂直半径，影响垂直布局的大小。
        </div>
      }>
        <InputNumber size="small" 
          min={0}
          onChange={ e => handleChange('y', e)} 
          value={yR}
        />
      </Tooltip>
    </div>
  </div>
}