import { ComponentType } from 'react';
import { NodeProps, NodeTypes } from 'reactflow';
// import nodes
import HuggingFaceModelNode from './nodes/HuggingFaceModelNode';
import NlpDatasetNode from './nodes/NlpDatasetNode';
import PredictNode from './nodes/PredictNode';
// import actions
import NlpDatasetLoadingNode from './actionNodes/NlpDatestLoadingNode';
import NlpDatasetClearingNode from './actionNodes/NlpDatasetClearingNode';
import NlpDatasetCopyingNode from './actionNodes/NlpDatasetCopyingNode';
import NlpDatasetCreatingByFieldNode from './actionNodes/NlpDatasetCreatingByFieldNode';
import NlpDatasetDeletingTextsWithoutFieldsNode from './actionNodes/NlpDatasetDeletingTextsWithoutFieldsNode';
import NlpTokenNerLabelsCreatingByPatternNode from './actionNodes/NlpTokenNerLabelsCreatingByPatternNode';
import NlpDatasetCreatingByTemplateNode from './actionNodes/NlpDatasetCreatingByTemplateNode';
// import metrics
import ClassificationMetricCalculationNode from './metricNodes/ClassificationMetricCalculationNode';
import NerMetricCalculationNode from './metricNodes/NerMetricCalculationNode';
import SummarizationMetricCalculationNode from './metricNodes/SummarizationMetricCalculationNode';

export interface NlpConstructorNode {
  name: string;
  node: ComponentType<NodeProps>;
}

export const listOfNlpConstructorNodes: NlpConstructorNode[] = [
  {
    name: 'Hugging face model',
    node: HuggingFaceModelNode,
  },
  {
    name: 'Nlp dataset',
    node: NlpDatasetNode,
  },
  {
    name: 'Predict',
    node: PredictNode,
  },
];

export const listOfNlpConstructorActionNodes: NlpConstructorNode[] = [
  {
    name: 'Load nlp dataset',
    node: NlpDatasetLoadingNode,
  },
  {
    name: 'Clear nlp dataset',
    node: NlpDatasetClearingNode,
  },
  {
    name: 'Copy nlp dataset',
    node: NlpDatasetCopyingNode,
  },
  {
    name: 'Create nlp dataset by field',
    node: NlpDatasetCreatingByFieldNode,
  },
  {
    name: 'Delete texts without fields nlp dataset',
    node: NlpDatasetDeletingTextsWithoutFieldsNode,
  },
  {
    name: 'Create nlp token ner labels by pattern',
    node: NlpTokenNerLabelsCreatingByPatternNode,
  },
  {
    name: 'Create nlp dataset by template',
    node: NlpDatasetCreatingByTemplateNode,
  },
];

export const listOfNlpConstructorMetricNodes: NlpConstructorNode[] = [
  {
    name: 'Classification Metric Calculation',
    node: ClassificationMetricCalculationNode,
  },
  {
    name: 'Ner Metric Calculation',
    node: NerMetricCalculationNode,
  },
  {
    name: 'Summarization Metric Calculation',
    node: SummarizationMetricCalculationNode,
  },
];

export const nlpConstructorNodeTypes: NodeTypes = Object.fromEntries(
  [
    ...listOfNlpConstructorNodes,
    ...listOfNlpConstructorActionNodes,
    ...listOfNlpConstructorMetricNodes,
  ].map((x) => [x.node.name, x.node])
);
