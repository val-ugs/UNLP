export interface TrainResultsDto {
  epoch: number;
  step: number;
  loss?: number;
  gradNorm?: number;
  learningRate?: number;
  trainRuntime?: number;
  trainSamplesPerSecond?: number;
  trainStepsPerSecond?: number;
  totalFlos?: number;
  trainLoss?: number;
}
