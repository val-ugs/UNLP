import React, { FC } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { NodeProps } from 'reactflow';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import './styles.scss';

interface CopyNlpDatasetNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
}

const NlpDatasetCopyingNode: FC<NodeProps<CopyNlpDatasetNodeProps>> = (
  node
) => {
  const inputHandles: InputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  const outputHandles: OutputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  return (
    <BaseNode
      className="nlp-dataset-copying-node"
      inputHandles={inputHandles}
      outputHandles={outputHandles}
    >
      <div className="nlp-dataset-copying-node__main">Copy Nlp Dataset</div>
    </BaseNode>
  );
};

export default NlpDatasetCopyingNode;
