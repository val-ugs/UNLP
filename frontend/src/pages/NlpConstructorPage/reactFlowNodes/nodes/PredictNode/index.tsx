import React, { FC } from 'react';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import BaseNode from '../../common/BaseNode';
import { InputHandlesItemProps } from '../../common/InputHandles';
import { OutputHandlesItemProps } from '../../common/OutputHandles';
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
  const inputHandles: InputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
    {
      id: 'huggingFaceModel',
    },
  ];

  const outputHandles: OutputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  return (
    <BaseNode
      className="predict-node"
      inputHandles={inputHandles}
      outputHandles={outputHandles}
    >
      <div className="predict-node__main">Predict</div>
    </BaseNode>
  );
};

export default PredictNode;
