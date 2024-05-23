import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { metricApi } from 'services/metricService';
import { SummarizationMetricCalculationRequest } from 'interfaces/dtos/summarizationMetricCalculationDto.interface';
import { summarizationMetricType } from 'interfaces/metric.interface';
import { enumToArray } from 'helpers/enumToArray';
import './styles.scss';

const emptySummarizationMetricCalculationRequest: SummarizationMetricCalculationRequest =
  {
    nlpDatasetId: 0,
    predictedNlpDatasetId: 0,
    metricName: '',
  };

const SummarizationMetricCalculation: FC = () => {
  const { t } = useTranslation();
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [
    summarizationMetricCalculationRequest,
    setSummarizationMetricCalculationRequest,
  ] = useState<SummarizationMetricCalculationRequest>(
    emptySummarizationMetricCalculationRequest
  );
  const [result, setResult] = useState<string>();
  const [calculateSummarization, {}] =
    metricApi.useCalculateSummarizationMutation();
  const {
    data: nlpDatasetsData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  const setNlpDatasetIdValue = (value: number) => {
    setSummarizationMetricCalculationRequest({
      ...summarizationMetricCalculationRequest,
      nlpDatasetId: value,
    });
  };
  const nlpDatasetSelect: SelectProps<number> = {
    className: 'summarization-metric-calculation__select',
    selectedValue: summarizationMetricCalculationRequest.nlpDatasetId ?? 0,
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
    setSummarizationMetricCalculationRequest({
      ...summarizationMetricCalculationRequest,
      predictedNlpDatasetId: value,
    });
  };
  const predictedNlpDatasetSelect: SelectProps<number> = {
    className: 'summarization-metric-calculation__select',
    selectedValue:
      summarizationMetricCalculationRequest.predictedNlpDatasetId ?? 0,
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
    setSummarizationMetricCalculationRequest({
      ...summarizationMetricCalculationRequest,
      metricName: value,
    });
  };
  const metricNameSelect: SelectProps<string> = {
    className: 'summarization-metric-calculation__select',
    selectedValue: summarizationMetricCalculationRequest.metricName ?? '',
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      summarizationMetricCalculationRequest.nlpDatasetId &&
      summarizationMetricCalculationRequest.nlpDatasetId &&
      summarizationMetricCalculationRequest.metricName
    ) {
      try {
        const result = await calculateSummarization(
          summarizationMetricCalculationRequest
        ).unwrap();
        setResult(result);
      } catch (error) {
        console.log(error);
        setResult(undefined);
      }
    }
  };

  return (
    <div className="summarization-metric-calculation">
      <form onSubmit={handleSubmit}>
        <div className="summarization-metric-calculation__item">
          <LabeledElement
            className="summarization-metric-calculation__labeled-element"
            labelElement={{
              value: t(
                'nerMetricCalculation.selectNlpDataset',
                'Select dataset'
              ),
            }}
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
        <div className="summarization-metric-calculation__item">
          <LabeledElement
            className="summarization-metric-calculation__labeled-element"
            labelElement={{
              value: t(
                'nerMetricCalculation.selectPredictedNlpDataset',
                'Select predicted dataset'
              ),
            }}
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
        <div className="summarization-metric-calculation__item">
          <LabeledElement
            className="summarization-metric-calculation__labeled-element"
            labelElement={{
              value: t('nerMetricCalculation.selectMetric', 'Select metric'),
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
        <div className="summarization-metric-calculation__item summarization-metric-calculation__item-button">
          <InputButton className="summarization-metric-calculation__button">
            {t('nerMetricCalculation.calculate', 'Calculate')}
          </InputButton>
        </div>
      </form>
      {result && (
        <pre className="summarization-metric-calculation__result">
          {t('nerMetricCalculation.result', 'Result:')} {result}
        </pre>
      )}
    </div>
  );
};

export default SummarizationMetricCalculation;
