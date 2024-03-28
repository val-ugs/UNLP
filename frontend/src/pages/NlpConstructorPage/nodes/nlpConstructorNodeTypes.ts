import HuggingFaceModelNode from './HuggingFaceModelNode';
import NlpDatasetNode from './NlpDatasetNode';
import PredictNode from './PredictNode';

// custom nodes
export const nlpConstructorNodeTypes = {
  HuggingFaceModelNode,
  NlpDatasetNode,
  PredictNode,
};

export interface NlpConstructorNode {
  name: string;
  type: string;
}

export const listOfNlpConstructorNodes: NlpConstructorNode[] = Object.keys(
  nlpConstructorNodeTypes
).map((type) => {
  return {
    name: type.replace('Node', '').replace(/([a-z])([A-Z])/g, '$1 $2'),
    type: type,
  };
});
