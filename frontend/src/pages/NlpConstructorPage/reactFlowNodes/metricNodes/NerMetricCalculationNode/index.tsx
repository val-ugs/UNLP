import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'hooks/redux';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import { enumToArray } from 'helpers/enumToArray';
import { nerMetricType } from 'interfaces/metric.interface';
import './styles.scss';

interface NerMetricCalculationNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
    predictedNlpDataset: NlpDatasetProps;
    metricName: string;
  };
  output: {
    result: string;
  };
  running: boolean;
}

const NerMetricCalculationNode: FC<NodeProps<NerMetricCalculationNodeProps>> = (
  node
) => {
  const { t } = useTranslation();
  const { editNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();

  const inputHandles: InputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
    {
      id: 'predictedNlpDataset',
    },
  ];

  const setMetricNameValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            metricName: value,
          },
        },
      })
    );
  };
  const metricNameSelect: SelectProps<string> = {
    className: 'ner-metric-calculation-node__select nodrag nowheel',
    selectedValue: node.data?.input?.metricName ?? '',
    setSelectedValue: setMetricNameValue,
    children: enumToArray(nerMetricType).map((nmt: nerMetricType) => {
      return (
        <Select.Item key={nmt} value={nmt}>
          {nmt}
        </Select.Item>
      );
    }),
  };

  return (
    <BaseNode
      className="ner-metric-calculation-node"
      inputHandles={inputHandles}
      running={node.data?.running}
    >
      <div className="ner-metric-calculation-node__main">
        <div className="ner-metric-calculation-node__title">
          {t(
            'nerMetricCalculationNode.nerMetricCalculation',
            'NER metric calculation'
          )}
        </div>
        <div className="ner-metric-calculation-node__item">
          <LabeledElement
            className="ner-metric-calculation-node__labeled-element"
            labelElement={{
              value: t(
                'nerMetricCalculationNode.selectMetric',
                'Select metric'
              ),
            }}
          >
            <Select
              className={metricNameSelect.className}
              selectedValue={metricNameSelect.selectedValue}
              setSelectedValue={metricNameSelect.setSelectedValue}
              disabled={metricNameSelect.disabled}
            >
              {metricNameSelect.children}
            </Select>
          </LabeledElement>
        </div>
        {node.data?.output?.result && (
          <pre className="ner-metric-calculation-node__item ner-metric-calculation-node__result">
            {t('nerMetricCalculationNode.result', 'Result: ')}
            {node.data?.output?.result}
          </pre>
        )}
      </div>
    </BaseNode>
  );
};

export default NerMetricCalculationNode;
