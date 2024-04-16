import ClassificationMetricCalculation from 'components/interstitial/metrics/ClassificationMetricCalculation';
import NerMetricCalculation from 'components/interstitial/metrics/NerMetricCalculation';
import SummarizationMetricCalculation from 'components/interstitial/metrics/SummarizationMetricCalculation';
import { HuggingFaceModelType } from 'interfaces/huggingFaceModel.interface';
import { MetricProps } from 'interfaces/metric.interface';

export const listOfMetrics: MetricProps[] = [
  {
    modelType: HuggingFaceModelType.Classification,
    component: <ClassificationMetricCalculation />,
  },
  {
    modelType: HuggingFaceModelType.Ner,
    component: <NerMetricCalculation />,
  },
  {
    modelType: HuggingFaceModelType.Summarization,
    component: <SummarizationMetricCalculation />,
  },
];
