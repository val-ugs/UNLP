export enum HuggingFaceModelType {
  Classification = 'Classification',
  Ner = 'Ner',
}

export interface TrainingArgsProps {
  learningRate: number;
  perDeviceTrainBatchSize: number;
  perDeviceEvalBatchSize: number;
  numTrainEpochs: number;
  weightDecay: number;
  evaluationStrategy: string;
  saveStrategy: string;
  loadBestModelAtEnd: boolean;
}

export interface HuggingFaceModelProps {
  id: number;
  name: string;
  modelNameOrPath: string;
  trainNlpDataset: number;
  validNlpDataset: number;
  evaluateMetricName: string;
  type: HuggingFaceModelType;
  trainingArgs: TrainingArgsProps;
}
