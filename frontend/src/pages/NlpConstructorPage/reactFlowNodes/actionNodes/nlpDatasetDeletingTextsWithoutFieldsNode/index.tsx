import React, { FC } from 'react';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import './styles.scss';

interface NlpDatasetDeletingTextsWithoutFieldsNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const NlpDatasetDeletingTextsWithoutFieldsNode: FC<
  NodeProps<NlpDatasetDeletingTextsWithoutFieldsNodeProps>
> = (node) => {
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
      className="nlp-dataset-deleting-texts-without-fields-node"
      inputHandles={inputHandles}
      outputHandles={outputHandles}
      running={node.data?.running}
    >
      <div className="nlp-dataset-deleting-texts-without-fields-node__main">
        Delete Texts Without Fields Nlp Dataset
      </div>
    </BaseNode>
  );
};

export default NlpDatasetDeletingTextsWithoutFieldsNode;
