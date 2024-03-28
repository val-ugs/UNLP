import React, { FC } from 'react';
import { Handle, Node, NodeProps, Position, useReactFlow } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import './styles.scss';

interface PredictNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
    huggingFaceModel: HuggingFaceModelProps;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
}

const PredictNode: FC<NodeProps<PredictNodeProps>> = (node) => {
  const { setNodes } = useReactFlow();

  return (
    <div className="predict-node">
      <Handle
        id="1"
        className="predict-node__handle-1"
        type={'target'}
        position={Position.Left}
      />
      <Handle
        id="2"
        className="predict-node__handle-2"
        type={'target'}
        position={Position.Left}
      />
      <div className="predict-node__main">Predict</div>
      <Handle
        className="predict-node__handle"
        type={'source'}
        position={Position.Right}
      />
    </div>
  );
};

export default PredictNode;

import { store } from 'store';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';

export const run = async (node: Node) => {
  console.log('-----');
  console.log('predict');
  console.log(node);
  const p = store.dispatch(
    huggingFaceModelApi.endpoints.predictHuggingFaceModel.initiate({
      huggingFaceModel: node.data?.input?.huggingFaceModel,
      testNlpDatasetId: 12, //node.data?.input?.nlpDataset?.id
    })
  );
  console.log(p);
  try {
    const response = await p.unwrap();
    return response;
  } catch (e) {
    console.log(e);
  }
  console.log('-----');
};
