import { ComponentType } from 'react';
import { NodeProps, NodeTypes } from 'reactflow';
// import nodes
import HuggingFaceModelNode from './nodes/HuggingFaceModelNode';
import NlpDatasetNode from './nodes/NlpDatasetNode';
import PredictNode from './nodes/PredictNode';
// import actions
import NlpDatasetClearingNode from './actionNodes/nlpDatasetClearingNode';
import NlpDatasetCopyingNode from './actionNodes/nlpDatasetCopyingNode';
import NlpDatasetCreatingByFieldNode from './actionNodes/nlpDatasetCreatingByFieldNode';
import NlpDatasetDeletingTextsWithoutFieldsNode from './actionNodes/nlpDatasetDeletingTextsWithoutFieldsNode';

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
    name: 'Nlp Dataset',
    node: NlpDatasetNode,
  },
  {
    name: 'Predict',
    node: PredictNode,
  },
];

export const listOfNlpConstructorActionNodes: NlpConstructorNode[] = [
  {
    name: 'Clear Nlp Dataset',
    node: NlpDatasetClearingNode,
  },
  {
    name: 'Copy Nlp Dataset',
    node: NlpDatasetCopyingNode,
  },
  {
    name: 'Create Nlp Dataset By Field',
    node: NlpDatasetCreatingByFieldNode,
  },
  {
    name: 'Delete Texts Without Fields Nlp Dataset',
    node: NlpDatasetDeletingTextsWithoutFieldsNode,
  },
];

export const nlpConstructorNodeTypes: NodeTypes = Object.fromEntries(
  [...listOfNlpConstructorNodes, ...listOfNlpConstructorActionNodes].map(
    (x) => [x.node.name, x.node]
  )
);
