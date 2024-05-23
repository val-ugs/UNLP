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
import { summarizationMetricType } from 'interfaces/metric.interface';
import './styles.scss';

interface SummarizationMetricCalculationNodeProps {
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

const SummarizationMetricCalculationNode: FC<
  NodeProps<SummarizationMetricCalculationNodeProps>
> = (node) => {
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
    className: 'summarization-metric-calculation-node__select nodrag nowheel',
    selectedValue: node.data?.input?.metricName ?? '',
    setSelectedValue: setMetricNameValue,
    children: enumToArray(summarizationMetricType).map(
      (smt: summarizationMetricType) => {
        return (
          <Select.Item key={smt} value={smt}>
            {smt}
          </Select.Item>
        );
      }
    ),
  };

  return (
    <BaseNode
      className="summarization-metric-calculation-node"
      inputHandles={inputHandles}
      running={node.data?.running}
    >
      <div className="summarization-metric-calculation-node__main">
        <div className="summarization-metric-calculation-node__title">
          {t(
            'summarizationMetricCalculationNode.summarizationMetricCalculation',
            'Summarization metric calculation'
          )}
        </div>
        <div className="summarization-metric-calculation-node__item">
          <LabeledElement
            className="summarization-metric-calculation-node__labeled-element"
            labelElement={{
              value: t(
                'summarizationMetricCalculationNode.selectMetric',
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
          <pre className="summarization-metric-calculation-node__item summarization-metric-calculation-node__result">
            {t('summarizationMetricCalculationNode.result', 'Result: ')}
            {node.data?.output?.result}
          </pre>
        )}
      </div>
    </BaseNode>
  );
};

export default SummarizationMetricCalculationNode;
