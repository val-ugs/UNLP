export interface ClassificationMetricCalculationRequest {
  nlpDatasetId: number;
  predictedNlpDatasetId: number;
  metricName: string;
  average?: string;
}
