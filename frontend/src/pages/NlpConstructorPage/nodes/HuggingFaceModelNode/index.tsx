import React from 'react';
import { Handle, Position } from 'reactflow';
import './styles.scss';

const HuggingFaceModelNode = ({ data }) => {
  return (
    <div className="hugging-face-model-node">
      <div className="hugging-face-model-node__name">Hugging face model</div>
      <Handle
        className="hugging-face-model-node__handle"
        type={'target'}
        position={Position.Left}
      />
      <Handle
        className="hugging-face-model-node__handle"
        type={'source'}
        position={Position.Right}
      />
    </div>
  );
};

export default HuggingFaceModelNode;
