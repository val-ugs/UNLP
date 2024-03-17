import React from 'react';
import { Handle, Position } from 'reactflow';
import './styles.scss';

const NlpDatasetNode = ({ data }) => {
  return (
    <div className="nlp-dataset-node">
      <div className="nlp-dataset-node__name">Nlp Dataset</div>
      <Handle
        className="nlp-dataset-node__handle"
        type={'source'}
        position={Position.Right}
      />
    </div>
  );
};

export default NlpDatasetNode;
