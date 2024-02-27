import React, { FC, useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAppDispatch } from 'hooks/redux';
import Button from 'components/common/Button';
import { enumToArray } from 'helpers/enumToArray';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import {
  HuggingFaceModelProps,
  HuggingFaceModelType,
} from 'interfaces/huggingFaceModel.interface';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import HuggingFaceModelInfo from './HuggingFaceModelInfo';
import { huggingFaceModelFormModalSlice } from 'store/reducers/huggingFaceModelFormModalSlice';
import './styles.scss';

interface PrepareHuggingFaceModelProps {
  className: string;
  huggingFaceModel: HuggingFaceModelProps | undefined;
  setHuggingFaceModel: React.Dispatch<
    React.SetStateAction<HuggingFaceModelProps | undefined>
  >;
}

const PrepareHuggingFaceModel: FC<PrepareHuggingFaceModelProps> = ({
  className,
  huggingFaceModel,
  setHuggingFaceModel,
}) => {
  const [huggingFaceModelType, setHuggingFaceModelType] =
    useState<HuggingFaceModelType>(HuggingFaceModelType.Classification);
  const [huggingFaceModels, setHuggingFaceModels] =
    useState<HuggingFaceModelProps[]>();
  const { activate } = huggingFaceModelFormModalSlice.actions;
  const dispatch = useAppDispatch();
  const {
    data: huggingFaceModelsData,
    isLoading,
    isError,
  } = huggingFaceModelApi.useGetHugginsFaceModelsByTypeQuery(
    huggingFaceModelType ?? skipToken
  );
  const [deleteHuggingFaceModel, {}] =
    huggingFaceModelApi.useDeleteHuggingFaceModelMutation();

  useEffect(() => {
    if (huggingFaceModelsData) setHuggingFaceModels(huggingFaceModelsData);
    if (isError) setHuggingFaceModels(undefined);
  }, [huggingFaceModelsData, isError]);

  const setHuggingFaceModelValue = (value: number) => {
    const huggingFaceModel = huggingFaceModels?.find((hfm) => hfm.id == value);
    if (huggingFaceModel) setHuggingFaceModel(huggingFaceModel);
  };
  const huggingFaceModelSelect: SelectProps<number> = {
    className: 'prepare-hugging-face-model__select',
    selectedValue: huggingFaceModel?.id ?? 0,
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

  const handleAdd = () => {
    dispatch(activate({ huggingFaceModel: undefined }));
  };

  const handleEdit = () => {
    dispatch(activate({ huggingFaceModel: huggingFaceModel }));
  };

  const handleDelete = () => {
    if (huggingFaceModel) deleteHuggingFaceModel(huggingFaceModel.id);
    setHuggingFaceModel(undefined);
  };

  return (
    <div className={`prepare-hugging-face-model ${className}`}>
      <div className="prepare-hugging-face-model__item">
        <Button
          className="prepare-hugging-face-model__add-button"
          onClick={handleAdd}
        >
          Create hugging face model
        </Button>
      </div>
      <div className="prepare-hugging-face-model__item">
        <div className="prepare-hugging-face-model__type">
          {enumToArray(HuggingFaceModelType).map(
            (hfmt: HuggingFaceModelType) => (
              <div className="prepare-hugging-face-model__type-item" key={hfmt}>
                <Button
                  className={`prepare-hugging-face-model__type-button ${
                    hfmt == huggingFaceModelType ? 'active' : ''
                  }`}
                  onClick={() => {
                    setHuggingFaceModelType(hfmt);
                    setHuggingFaceModel(undefined);
                  }}
                >
                  {hfmt}
                </Button>
              </div>
            )
          )}
        </div>
      </div>
      <div className="prepare-hugging-face-model__item">
        {huggingFaceModels ? (
          <div className="prepare-hugging-face-model__model">
            <LabeledElement
              className="prepare-hugging-face-model__model-item prepare-hugging-face-model__labeled-element"
              labelElement={{ value: 'Select hugging face model' }}
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
            {huggingFaceModel && (
              <>
                <div className="prepare-hugging-face-model__model-item">
                  <Button
                    className="prepare-hugging-face-model__edit-button"
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                </div>
                <div className="prepare-hugging-face-model__model-item">
                  <Button
                    className="prepare-hugging-face-model__delete-button"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          'Hugging face models not found'
        )}
        <HuggingFaceModelInfo huggingFaceModel={huggingFaceModel} />
      </div>
    </div>
  );
};

export default PrepareHuggingFaceModel;
