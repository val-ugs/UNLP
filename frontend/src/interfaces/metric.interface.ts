import { HuggingFaceModelType } from './huggingFaceModel.interface';
import { ReactNode } from 'react';

// Classification
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

// Ner
export enum nerMetricType {
  Seqeval = 'seqeval',
}

// Summarization
export enum summarizationMetricType {
  Rouge = 'rouge',
}

export interface MetricProps {
  modelType: HuggingFaceModelType;
  component: ReactNode;
}