import React, { FC } from 'react';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import './styles.scss';

interface NlpDatasetCopyingNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const NlpDatasetCopyingNode: FC<NodeProps<NlpDatasetCopyingNodeProps>> = (
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
      running={node.data?.running}
    >
      <div className="nlp-dataset-copying-node__main">Copy nlp dataset</div>
    </BaseNode>
  );
};

export default NlpDatasetCopyingNode;
