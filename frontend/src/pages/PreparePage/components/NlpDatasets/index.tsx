import React, { FC, useEffect, useState } from 'react';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import Button from 'components/common/Button';
import './styles.scss';

interface NlpDatasetListProps {
  className?: string;
  selectedNlpDatasetId: number | undefined;
  setSelectedNlpDatasetId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
}

const NlpDatasetList: FC<NlpDatasetListProps> = ({
  className,
  selectedNlpDatasetId,
  setSelectedNlpDatasetId,
}) => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const {
    data: nlpDatasetsData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();
  const [deleteNlpDataset, {}] = nlpDatasetApi.useDeleteNlpDatasetMutation();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  const handleDelete = () => {
    if (selectedNlpDatasetId) deleteNlpDataset(selectedNlpDatasetId);
    if (nlpDatasets.length > 1) {
      const deletedNlpDataset = nlpDatasets.find(
        (nlpDataset) => nlpDataset.id === selectedNlpDatasetId
      );
      if (deletedNlpDataset) {
        const deletedNlpDatasetIndex = nlpDatasets.indexOf(deletedNlpDataset);
        setSelectedNlpDatasetId(
          nlpDatasets[
            deletedNlpDatasetIndex > 0
              ? deletedNlpDatasetIndex - 1
              : deletedNlpDatasetIndex + 1
          ].id
        );
      }
    } else setNlpDatasets([]);
  };

  return (
    <div className={`nlp-datasets ${className}`}>
      {nlpDatasets && nlpDatasets.length > 0 ? (
        <div className="nlp-datasets__left">
          <div className="nlp-datasets__list">
            {nlpDatasets.map((nlpDataset) => (
              <div className="nlp-datasets__item" key={nlpDataset.id}>
                <Button
                  className={`nlp-datasets__item-button {} ${
                    selectedNlpDatasetId === nlpDataset.id ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelectedNlpDatasetId(nlpDataset.id);
                  }}
                >
                  Dataset {nlpDataset.id}
                </Button>
              </div>
            ))}
          </div>
          <div className="nlp-datasets__right">
            <div className="nlp-datasets__delete">
              <Button
                className="nlp-datasets__delete-button"
                onClick={handleDelete}
              >
                Delete selected database
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="nlp-datasets__not-found">Datasets not found</div>
      )}
    </div>
  );
};

export default NlpDatasetList;
