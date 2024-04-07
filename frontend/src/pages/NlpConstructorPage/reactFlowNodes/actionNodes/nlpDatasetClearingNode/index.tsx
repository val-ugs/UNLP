import React, { FC } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import { fieldType } from 'data/enums/fieldType';
import { enumToArray } from 'helpers/enumToArray';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import './styles.scss';

interface NlpDatasetClearingNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
    clearField: fieldType;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const NlpDatasetClearingNode: FC<NodeProps<NlpDatasetClearingNodeProps>> = (
  node
) => {
  const { editNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();

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

  const setClearFieldValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: { input: { clearField: value as fieldType } },
      })
    );
  };
  const clearFieldSelect: SelectProps<string> = {
    className: 'nlp-dataset-clearing-node__select nodrag nowheel',
    selectedValue: node.data?.input?.clearField ?? '',
    setSelectedValue: setClearFieldValue,
    children: enumToArray(fieldType).map((cf: fieldType) => {
      return (
        <Select.Item key={cf} value={cf}>
          {cf}
        </Select.Item>
      );
    }),
  };

  return (
    <BaseNode
      className="nlp-dataset-clearing-node"
      inputHandles={inputHandles}
      outputHandles={outputHandles}
      running={node.data?.running}
    >
      <div className="nlp-dataset-clearing-node__main">
        <LabeledElement
          className="nlp-dataset-clearing-node__labeled-element"
          labelElement={{ value: 'Select field to clear' }}
        >
          <Select
            className={clearFieldSelect.className}
            selectedValue={clearFieldSelect.selectedValue}
            setSelectedValue={clearFieldSelect.setSelectedValue}
            disabled={clearFieldSelect.disabled}
          >
            {clearFieldSelect.children}
          </Select>
        </LabeledElement>
      </div>
    </BaseNode>
  );
};

export default NlpDatasetClearingNode;
