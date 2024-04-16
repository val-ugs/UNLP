import { HuggingFaceModelType } from './huggingFaceModel.interface';
import { ReactNode } from 'react';

export interface MetricProps {
  modelType: HuggingFaceModelType;
  component: ReactNode;
}
