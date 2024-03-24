import React, { FC, useEffect, useState } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import './styles.scss';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import {
  HuggingFaceModelProps,
  HuggingFaceModelType,
} from 'interfaces/huggingFaceModel.interface';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import { skipToken } from '@reduxjs/toolkit/query';
import Button from 'components/common/Button';
import { enumToArray } from 'helpers/enumToArray';

const HuggingFaceModelNode: FC<NodeProps> = ({ data }) => {
  const [huggingFaceModelId, setHuggingFaceModelId] = useState<number>();
  const [huggingFaceModelType, setHuggingFaceModelType] =
    useState<HuggingFaceModelType>(HuggingFaceModelType.Classification);
  const [huggingFaceModels, setHuggingFaceModels] =
    useState<HuggingFaceModelProps[]>();
  const {
    data: huggingFaceModelsData,
    isLoading: huggingFaceModelsLoading,
    isError,
  } = huggingFaceModelApi.useGetHugginsFaceModelsByTypeQuery(
    huggingFaceModelType ?? skipToken
  );

  useEffect(() => {
    if (huggingFaceModelsData) setHuggingFaceModels(huggingFaceModelsData);
    if (isError) setHuggingFaceModels(undefined);
  }, [huggingFaceModelsData, isError]);

  const setHuggingFaceModelValue = (value: number) => {
    const huggingFaceModel = huggingFaceModels?.find((hfm) => hfm.id == value);
    if (huggingFaceModel) setHuggingFaceModelId(huggingFaceModel.id);
  };
  const huggingFaceModelSelect: SelectProps<number> = {
    className: 'hugging-face-model-node__select nodrag nowheel',
    selectedValue: huggingFaceModelId ?? 0,
    setSelectedValue: setHuggingFaceModelValue,
    children: huggingFaceModels?.map(
      (huggingFaceModel: HuggingFaceModelProps) => {
        return (
          <Select.Item key={huggingFaceModel.id} value={huggingFaceModel.id}>
            {huggingFaceModel.name}
          </Select.Item>
        );
      }
    ),
  };

  return (
    <div className="hugging-face-model-node nopan">
      <Handle
        className="hugging-face-model-node__handle"
        type={'target'}
        position={Position.Left}
      />
      <div className="hugging-face-model-node__main">
        <div className="hugging-face-model-node__main-item">
          <div className="hugging-face-model-node__type">
            {enumToArray(HuggingFaceModelType).map(
              (hfmt: HuggingFaceModelType) => (
                <div className="hugging-face-model-node__type-item" key={hfmt}>
                  <Button
                    className={`hugging-face-model-node__type-button ${
                      hfmt == huggingFaceModelType ? 'active' : ''
                    }`}
                    onClick={() => {
                      setHuggingFaceModelType(hfmt);
                      setHuggingFaceModelId(0);
                    }}
                  >
                    {hfmt}
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
        <div className="hugging-face-model-node__main-item">
          {huggingFaceModels ? (
            <>
              <LabeledElement
                className="hugging-face-model-node__labeled-element"
                labelElement={{ value: 'Hugging face model' }}
              >
                <Select
                  className={huggingFaceModelSelect.className}
                  selectedValue={huggingFaceModelSelect.selectedValue}
                  setSelectedValue={huggingFaceModelSelect.setSelectedValue}
                  disabled={huggingFaceModelSelect.disabled}
                >
                  {huggingFaceModelSelect.children}
                </Select>
              </LabeledElement>
              <Handle
                className="hugging-face-model-node__handle"
                type={'source'}
                position={Position.Right}
              />
            </>
          ) : (
            'Hugging face models not found'
          )}
        </div>
      </div>
    </div>
  );
};

export default HuggingFaceModelNode;
