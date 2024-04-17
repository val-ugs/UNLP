import React, { FC } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import { enumToArray } from 'helpers/enumToArray';
import {
  classificationMetricType,
  f1ScoreAverageType,
} from 'interfaces/metric.interface';
import './styles.scss';

interface ClassificationMetricCalculationNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
    predictedNlpDataset: NlpDatasetProps;
    metricName: string;
    average: string;
  };
  output: {
    result: string;
  };
  running: boolean;
}

const ClassificationMetricCalculationNode: FC<
  NodeProps<ClassificationMetricCalculationNodeProps>
> = (node) => {
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
    className: 'classification-metric-calculation-node__select nodrag nowheel',
    selectedValue: node.data?.input?.metricName ?? '',
    setSelectedValue: setMetricNameValue,
    children: enumToArray(classificationMetricType).map(
      (cmt: classificationMetricType) => {
        return (
          <Select.Item key={cmt} value={cmt}>
            {cmt}
          </Select.Item>
        );
      }
    ),
  };

  const setAverageValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            average: value,
          },
        },
      })
    );
  };
  const averageSelect: SelectProps<string> = {
    className: 'classification-metric-calculation-node__select nodrag nowheel',
    selectedValue: node.data?.input?.average ?? '',
    setSelectedValue: setAverageValue,
    children: enumToArray(f1ScoreAverageType).map(
      (fsat: f1ScoreAverageType) => {
        return (
          <Select.Item key={fsat} value={fsat}>
            {fsat}
          </Select.Item>
        );
      }
    ),
  };

  return (
    <BaseNode
      className="classification-metric-calculation-node"
      inputHandles={inputHandles}
      running={node.data?.running}
    >
      <div className="classification-metric-calculation-node__main">
        <div className="classification-metric-calculation-node__title">
          Classification metric calculation
        </div>
        <div className="classification-metric-calculation-node__item">
          <LabeledElement
            className="classification-metric-calculation-node__labeled-element"
            labelElement={{ value: 'Select metric' }}
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
        {node.data?.input?.metricName == classificationMetricType.F1Score && (
          <div className="classification-metric-calculation-node__item">
            <LabeledElement
              className="classification-metric-calculation-node__labeled-element"
              labelElement={{ value: 'Select average' }}
            >
              <Select
                className={averageSelect.className}
                selectedValue={averageSelect.selectedValue}
                setSelectedValue={averageSelect.setSelectedValue}
                disabled={averageSelect.disabled}
              >
                {averageSelect.children}
              </Select>
            </LabeledElement>
          </div>
        )}
        {node.data?.output?.result && (
          <pre className="classification-metric-calculation-node__item classification-metric-calculation-node__result">
            Result: {node.data?.output?.result}
          </pre>
        )}
      </div>
    </BaseNode>
  );
};

export default ClassificationMetricCalculationNode;
