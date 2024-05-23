import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import './styles.scss';

interface PredictNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
    huggingFaceModel: HuggingFaceModelProps;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const PredictNode: FC<NodeProps<PredictNodeProps>> = (node) => {
  const { t } = useTranslation();
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
      running={node.data?.running}
    >
      <div className="predict-node__main">
        {t('predictNode.predict', 'Predict')}
      </div>
    </BaseNode>
  );
};

export default PredictNode;
