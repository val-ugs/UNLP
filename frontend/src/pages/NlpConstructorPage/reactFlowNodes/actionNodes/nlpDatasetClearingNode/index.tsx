import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
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
    field: fieldType;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const NlpDatasetClearingNode: FC<NodeProps<NlpDatasetClearingNodeProps>> = (
  node
) => {
  const { t } = useTranslation();
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

  const setFieldValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: { input: { field: value as fieldType } },
      })
    );
  };
  const clearFieldSelect: SelectProps<string> = {
    className: 'nlp-dataset-clearing-node__select nodrag nowheel',
    selectedValue: node.data?.input?.field ?? '',
    setSelectedValue: setFieldValue,
    children: enumToArray(fieldType).map((ft: fieldType) => {
      return (
        <Select.Item key={ft} value={ft}>
          {ft}
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
          labelElement={{
            value: t(
              'nlpDatasetClearingNode.selectFieldToClear',
              'Select field to clear'
            ),
          }}
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
