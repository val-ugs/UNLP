import ClassificationMetricCalculation from 'components/interstitial/metrics/ClassificationMetricCalculation';
import { HuggingFaceModelType } from 'interfaces/huggingFaceModel.interface';
import { MetricProps } from 'interfaces/metric.interface';

export const listOfMetrics: MetricProps[] = [
  {
    modelType: HuggingFaceModelType.Classification,
    component: <ClassificationMetricCalculation />,
  },
  {
    modelType: HuggingFaceModelType.Ner,
    component: <>Ner</>,
  },
  {
    modelType: HuggingFaceModelType.Summarization,
    component: <>Summarization</>,
  },
];
