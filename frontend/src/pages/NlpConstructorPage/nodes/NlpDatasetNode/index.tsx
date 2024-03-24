import React, { FC, useEffect, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import './styles.scss';

const NlpDatasetNode: FC<NodeProps> = ({ data }) => {
  const [nlpDatasetId, setNlpDatasetId] = useState<number>();
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
    setNlpDatasetId(value);
  };
  const nlpDatasetSelect: SelectProps<number> = {
    className: 'nlp-dataset-node__select nodrag nowheel',
    selectedValue: nlpDatasetId ?? 0,
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
        className="nlp-dataset-node__handle"
        type={'source'}
        position={Position.Right}
      />
    </div>
  );
};

export default NlpDatasetNode;
