import React, { FC, FormEvent, useEffect, useState } from 'react';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { metricApi } from 'services/metricService';
import { NerMetricCalculationRequest } from 'interfaces/dtos/nerMetricCalculationDto.interface';
import { nerMetricType } from 'interfaces/metric.interface';
import { enumToArray } from 'helpers/enumToArray';
import './styles.scss';

const emptyNerMetricCalculationRequest: NerMetricCalculationRequest = {
  nlpDatasetId: 0,
  predictedNlpDatasetId: 0,
  metricName: '',
};

const NerMetricCalculation: FC = () => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [nerMetricCalculationRequest, setNerMetricCalculationRequest] =
    useState<NerMetricCalculationRequest>(emptyNerMetricCalculationRequest);
  const [result, setResult] = useState<string>();
  const [calculateNer, {}] = metricApi.useCalculateNerMutation();
  const {
    data: nlpDatasetsData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  const setNlpDatasetIdValue = (value: number) => {
    setNerMetricCalculationRequest({
      ...nerMetricCalculationRequest,
      nlpDatasetId: value,
    });
  };
  const nlpDatasetSelect: SelectProps<number> = {
    className: 'ner-metric-calculation__select',
    selectedValue: nerMetricCalculationRequest.nlpDatasetId ?? 0,
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
    setNerMetricCalculationRequest({
      ...nerMetricCalculationRequest,
      predictedNlpDatasetId: value,
    });
  };
  const predictedNlpDatasetSelect: SelectProps<number> = {
    className: 'ner-metric-calculation__select',
    selectedValue: nerMetricCalculationRequest.predictedNlpDatasetId ?? 0,
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
    setNerMetricCalculationRequest({
      ...nerMetricCalculationRequest,
      metricName: value,
    });
  };
  const metricNameSelect: SelectProps<string> = {
    className: 'ner-metric-calculation__select',
    selectedValue: nerMetricCalculationRequest.metricName ?? '',
    setSelectedValue: setMetricNameValue,
    children: enumToArray(nerMetricType).map((nmt: nerMetricType) => {
      return (
        <Select.Item key={nmt} value={nmt}>
          {nmt}
        </Select.Item>
      );
    }),
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      nerMetricCalculationRequest.nlpDatasetId &&
      nerMetricCalculationRequest.nlpDatasetId &&
      nerMetricCalculationRequest.metricName
    ) {
      try {
        const result = await calculateNer(nerMetricCalculationRequest).unwrap();
        setResult(result);
      } catch (error) {
        console.log(error);
        setResult(undefined);
      }
    }
  };

  return (
    <div className="ner-metric-calculation">
      <form onSubmit={handleSubmit}>
        <div className="ner-metric-calculation__item">
          <LabeledElement
            className="ner-metric-calculation__labeled-element"
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
        <div className="ner-metric-calculation__item">
          <LabeledElement
            className="ner-metric-calculation__labeled-element"
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
        <div className="ner-metric-calculation__item">
          <LabeledElement
            className="ner-metric-calculation__labeled-element"
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
        <div className="ner-metric-calculation__item ner-metric-calculation__item-button">
          <InputButton className="ner-metric-calculation__button">
            Calculate
          </InputButton>
        </div>
      </form>
      {result && (
        <pre className="ner-metric-calculation__result">Result: {result}</pre>
      )}
    </div>
  );
};

export default NerMetricCalculation;
