import { ComponentType } from 'react';
import { NodeProps, NodeTypes } from 'reactflow';
// import nodes
import HuggingFaceModelNode from './nodes/HuggingFaceModelNode';
import NlpDatasetNode from './nodes/NlpDatasetNode';
import PredictNode from './nodes/PredictNode';
// import actions
import NlpDatasetCopyingNode from './actionNodes/nlpDatasetCopyingNode';

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
    name: 'Copy Nlp Dataset',
    node: NlpDatasetCopyingNode,
  },
];

export const nlpConstructorNodeTypes: NodeTypes = Object.fromEntries(
  [...listOfNlpConstructorNodes, ...listOfNlpConstructorActionNodes].map(
    (x) => [x.node.name, x.node]
  )
);
