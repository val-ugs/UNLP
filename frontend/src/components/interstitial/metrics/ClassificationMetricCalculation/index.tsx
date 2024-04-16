import React, { FC, FormEvent, useEffect, useState } from 'react';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { metricApi } from 'services/metricService';
import { ClassificationMetricCalculationRequest } from 'interfaces/dtos/classificationMetricCalculationDto.interface';
import {
  classificationMetricType,
  f1ScoreAverageType,
} from 'interfaces/metric.interface';
import { enumToArray } from 'helpers/enumToArray';
import './styles.scss';

const emptyClassificationMetricCalculationRequest: ClassificationMetricCalculationRequest =
  {
    nlpDatasetId: 0,
    predictedNlpDatasetId: 0,
    metricName: '',
    average: '',
  };

const ClassificationMetricCalculation: FC = () => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [
    classificationMetricCalculationRequest,
    setClassificationMetricCalculationRequest,
  ] = useState<ClassificationMetricCalculationRequest>(
    emptyClassificationMetricCalculationRequest
  );
  const [result, setResult] = useState<string>();
  const [calculateClassification, {}] =
    metricApi.useCalculateClassificationMutation();
  const {
    data: nlpDatasetsData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  const setNlpDatasetIdValue = (value: number) => {
    setClassificationMetricCalculationRequest({
      ...classificationMetricCalculationRequest,
      nlpDatasetId: value,
    });
  };
  const nlpDatasetSelect: SelectProps<number> = {
    className: 'classification-metric-calculation__select',
    selectedValue: classificationMetricCalculationRequest.nlpDatasetId ?? 0,
    setSelectedValue: setNlpDatasetIdValue,
    children: nlpDatasets?.map((nlpDataset: NlpDatasetProps) => {
      return (
        <Select.Item key={nlpDataset.id} value={nlpDataset.id}>
          {`Dataset ${nlpDataset.id}`}
        </Select.Item>
      );
    }),
  };

  const setPredictedNlpDatasetIdValue = (value: number) => {
    setClassificationMetricCalculationRequest({
      ...classificationMetricCalculationRequest,
      predictedNlpDatasetId: value,
    });
  };
  const predictedNlpDatasetSelect: SelectProps<number> = {
    className: 'classification-metric-calculation__select',
    selectedValue:
      classificationMetricCalculationRequest.predictedNlpDatasetId ?? 0,
    setSelectedValue: setPredictedNlpDatasetIdValue,
    children: nlpDatasets?.map((nlpDataset: NlpDatasetProps) => {
      return (
        <Select.Item key={nlpDataset.id} value={nlpDataset.id}>
          {`Dataset ${nlpDataset.id}`}
        </Select.Item>
      );
    }),
  };

  const setMetricNameValue = (value: string) => {
    setClassificationMetricCalculationRequest({
      ...classificationMetricCalculationRequest,
      metricName: value,
    });
  };
  const metricNameSelect: SelectProps<string> = {
    className: 'classification-metric-calculation__select',
    selectedValue: classificationMetricCalculationRequest.metricName ?? '',
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
    setClassificationMetricCalculationRequest({
      ...classificationMetricCalculationRequest,
      average: value,
    });
  };
  const averageSelect: SelectProps<string> = {
    className: 'classification-metric-calculation__select',
    selectedValue: classificationMetricCalculationRequest.average ?? '',
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      classificationMetricCalculationRequest.nlpDatasetId &&
      classificationMetricCalculationRequest.nlpDatasetId &&
      classificationMetricCalculationRequest.metricName
    ) {
      try {
        const result = await calculateClassification(
          classificationMetricCalculationRequest
        ).unwrap();
        setResult(result);
      } catch (error) {
        console.log(error);
        setResult(undefined);
      }
    }
  };

  return (
    <div className="classification-metric-calculation">
      <form onSubmit={handleSubmit}>
        <div className="classification-metric-calculation__item">
          <LabeledElement
            className="classification-metric-calculation__labeled-element"
            labelElement={{ value: 'Select nlp dataset' }}
          >
            <Select
              className={nlpDatasetSelect.className}
              selectedValue={nlpDatasetSelect.selectedValue}
              setSelectedValue={nlpDatasetSelect.setSelectedValue}
              disabled={nlpDatasetSelect.disabled}
            >
              {nlpDatasetSelect.children}
            </Select>
          </LabeledElement>
        </div>
        <div className="classification-metric-calculation__item">
          <LabeledElement
            className="classification-metric-calculation__labeled-element"
            labelElement={{ value: 'Select predicted nlp dataset' }}
          >
            <Select
              className={predictedNlpDatasetSelect.className}
              selectedValue={predictedNlpDatasetSelect.selectedValue}
              setSelectedValue={predictedNlpDatasetSelect.setSelectedValue}
              disabled={predictedNlpDatasetSelect.disabled}
            >
              {predictedNlpDatasetSelect.children}
            </Select>
          </LabeledElement>
        </div>
        <div className="classification-metric-calculation__item">
          <LabeledElement
            className="classification-metric-calculation__labeled-element"
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
        {classificationMetricCalculationRequest.metricName ==
          classificationMetricType.F1Score && (
          <div className="classification-metric-calculation__item">
            <LabeledElement
              className="classification-metric-calculation__labeled-element"
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
        <div className="classification-metric-calculation__item classification-metric-calculation__item-button">
          <InputButton className="classification-metric-calculation__button">
            Calculate
          </InputButton>
        </div>
      </form>
      {result && (
        <div className="classification-metric-calculation__result">
          {classificationMetricCalculationRequest.metricName} metric result:{' '}
          {result}
        </div>
      )}
    </div>
  );
};

export default ClassificationMetricCalculation;
