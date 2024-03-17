import HuggingFaceModelNode from './HuggingFaceModelNode';
import NlpDatasetNode from './NlpDatasetNode';

// custom nodes
export const nlpConstructorNodeTypes = {
  HuggingFaceModelNode,
  NlpDatasetNode,
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
