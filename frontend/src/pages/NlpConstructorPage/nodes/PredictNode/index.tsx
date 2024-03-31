import React, { FC } from 'react';
import { Handle, Node, NodeProps, Position } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import './styles.scss';

interface PredictNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
    huggingFaceModel: HuggingFaceModelProps;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
}

const PredictNode: FC<NodeProps<PredictNodeProps>> = (node) => {
  return (
    <div className="predict-node">
      <Handle
        id="nlpDataset"
        className="predict-node__handle-1"
        type={'target'}
        position={Position.Left}
      />
      <Handle
        id="huggingFaceModel"
        className="predict-node__handle-2"
        type={'target'}
        position={Position.Left}
      />
      <div className="predict-node__main">Predict</div>
      <Handle
        id="nlpDataset"
        className="predict-node__handle"
        type={'source'}
        position={Position.Right}
      />
    </div>
  );
};

export default PredictNode;
