import { HuggingFaceModelType } from 'interfaces/huggingFaceModel.interface';
import { MetricProps } from 'interfaces/metric.interface';

export const listOfMetrics: MetricProps[] = [
  {
    modelType: HuggingFaceModelType.Classification,
    component: <>Classification</>,
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
