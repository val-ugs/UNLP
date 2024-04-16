import { HuggingFaceModelType } from './huggingFaceModel.interface';
import { ReactNode } from 'react';

export enum classificationMetricType {
  Accuracy = 'accuracy',
  F1Score = 'f1',
}

export enum f1ScoreAverageType {
  None = 'None',
  Micro = 'micro',
  Macro = 'macro',
  Weighted = 'weighted',
}

export interface MetricProps {
  modelType: HuggingFaceModelType;
  component: ReactNode;
}
