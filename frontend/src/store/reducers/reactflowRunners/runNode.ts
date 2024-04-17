import { Node } from 'reactflow';
// import node runners
import { run as runHuggingFaceModel } from './nodeRunners/nodes/runHuggingFaceModelNode';
import { run as runNlpDataset } from './nodeRunners/nodes/runNlpDatasetNode';
import { run as runPredict } from './nodeRunners/nodes/runPredictNode';
// import action node runners
import { run as runClearNlpDataset } from './nodeRunners/actionNodes/runClearNlpDataset';
import { run as runCopyNlpDataset } from './nodeRunners/actionNodes/runCopyNlpDataset';
import { run as runCreateNlpDatasetByField } from './nodeRunners/actionNodes/runCreateNlpDatasetByField';
import { run as runDeleteTextsWithoutFieldsNlpDataset } from './nodeRunners/actionNodes/runDeleteTextsWithoutFieldsNlpDataset';
// import metric node runners
import { run as runCalculateClassificationMetric } from './nodeRunners/metricNodes/runCalculateClassificationMetric';
import { run as runCalculateNerMetric } from './nodeRunners/metricNodes/runCalculateNerMetric';
import { run as runCalculateSummarizationMetric } from './nodeRunners/metricNodes/runCalculateSummarizationMetric';

export const runNode = async (node: Node, thunkApi: any) => {
  switch (node.type) {
    // nodes
    case 'HuggingFaceModelNode':
      return await runHuggingFaceModel(node);
    case 'NlpDatasetNode':
      return await runNlpDataset(node);
    case 'PredictNode':
      return await runPredict(node, thunkApi);
    // action nodes
    case 'NlpDatasetClearingNode':
      return await runClearNlpDataset(node, thunkApi);
    case 'NlpDatasetCopyingNode':
      return await runCopyNlpDataset(node, thunkApi);
    case 'NlpDatasetCreatingByFieldNode':
      return await runCreateNlpDatasetByField(node, thunkApi);
    case 'NlpDatasetDeletingTextsWithoutFieldsNode':
      return await runDeleteTextsWithoutFieldsNlpDataset(node, thunkApi);
    // metric nodes
    case 'ClassificationMetricCalculationNode':
      return await runCalculateClassificationMetric(node, thunkApi);
    case 'NerMetricCalculationNode':
      return await runCalculateNerMetric(node, thunkApi);
    case 'SummarizationMetricCalculationNode':
      return await runCalculateSummarizationMetric(node, thunkApi);
  }
};
