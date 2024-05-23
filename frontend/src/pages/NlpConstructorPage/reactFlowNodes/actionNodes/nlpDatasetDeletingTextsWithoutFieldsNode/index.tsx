import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        {t(
          'NlpDatasetDeletingTextsWithoutFieldsNode.deleteTextsWithoutFieldsNlpDataset',
          'Delete texts without fields dataset'
        )}
      </div>
    </BaseNode>
  );
};

export default NlpDatasetDeletingTextsWithoutFieldsNode;
