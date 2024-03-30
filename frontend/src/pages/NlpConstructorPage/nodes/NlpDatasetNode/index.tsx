import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { Handle, Node, NodeProps, Position } from 'reactflow';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import './styles.scss';

interface NlpDatasetNodeProps {
  input: undefined;
  output: {
    nlpDataset: NlpDatasetProps;
  };
}

const NlpDatasetNode: FC<NodeProps<NlpDatasetNodeProps>> = (node) => {
  const { editNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const {
    data: nlpDatasetsData,
    error,
    isLoading: nlpDatasetsLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();
  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  const setNlpDatasetIdValue = (value: number) => {
    const nlpDataset = nlpDatasets?.find((nd) => nd.id == value);
    if (nlpDataset)
      dispatch(
        editNode({
          id: node.id,
          newData: { output: { nlpDataset: nlpDataset } },
        })
      );
    console.log(node);
  };

  const nlpDatasetSelect: SelectProps<number> = {
    className: 'nlp-dataset-node__select nodrag nowheel',
    selectedValue: node.data?.output?.nlpDataset?.id ?? 0,
    setSelectedValue: setNlpDatasetIdValue,
    children: nlpDatasets?.map((nlpDataset: NlpDatasetProps) => {
      return (
        <Select.Item key={nlpDataset.id} value={nlpDataset.id}>
          {`Dataset ${nlpDataset.id}`}
        </Select.Item>
      );
    }),
  };

  return (
    <div className="nlp-dataset-node nopan">
      <div className="nlp-dataset-node__main">
        <LabeledElement
          className="nlp-dataset-node__labeled-element"
          labelElement={{ value: 'Nlp dataset' }}
        >
          <Select
            className={nlpDatasetSelect.className}
            selectedValue={nlpDatasetSelect.selectedValue}
            setSelectedValue={nlpDatasetSelect.setSelectedValue}
            disabled={nlpDatasetSelect.disabled}
          >
            {nlpDatasetSelect.children}
          </Select>
        </LabeledElement>
      </div>
      <Handle
        id="nlpDataset"
        className="nlp-dataset-node__handle"
        type={'source'}
        position={Position.Right}
      />
    </div>
  );
};

export default NlpDatasetNode;

export const run = (node: Node) => {
  console.log('-----');
  console.log('nlpDataset');
  console.log(node);
  console.log('-----');
  console.log(node);

  return node.data.output;
};
