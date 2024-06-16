import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import HuggingFaceModelInfo from 'components/interstitial/HuggingFaceModelInfo';
import { huggingFaceModelFormModalSlice } from 'store/reducers/huggingFaceModelFormModalSlice';
import './styles.scss';

interface HuggingFaceModelTrainProps {
  className: string;
  huggingFaceModel: HuggingFaceModelProps | undefined;
  setHuggingFaceModel: React.Dispatch<
    React.SetStateAction<HuggingFaceModelProps | undefined>
  >;
}

const HuggingFaceModelTrain: FC<HuggingFaceModelTrainProps> = ({
  className,
  huggingFaceModel,
  setHuggingFaceModel,
}) => {
  const { t } = useTranslation();
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
    className: 'hugging-face-model-train__select',
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
    <div className={`hugging-face-model-train ${className}`}>
      <div className="hugging-face-model-train__item">
        <Button
          className="hugging-face-model-train__add-button"
          onClick={handleAdd}
        >
          {t('huggingFaceModelTrain.createHuggingFaceModel', 'Create model')}
        </Button>
      </div>
      <div className="hugging-face-model-train__item">
        <div className="hugging-face-model-train__type">
          {enumToArray(HuggingFaceModelType).map(
            (hfmt: HuggingFaceModelType) => (
              <div className="hugging-face-model-train__type-item" key={hfmt}>
                <Button
                  className={`hugging-face-model-train__type-button ${
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
      <div className="hugging-face-model-train__item">
        {huggingFaceModels ? (
          <div className="hugging-face-model-train__model">
            <LabeledElement
              className="hugging-face-model-train__model-item hugging-face-model-train__labeled-element"
              labelElement={{
                value: t(
                  'huggingFaceModelTrain.selectHuggingFaceModel',
                  'Select model'
                ),
              }}
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
                <div className="hugging-face-model-train__model-item">
                  <Button
                    className="hugging-face-model-train__edit-button"
                    onClick={handleEdit}
                  >
                    {t('huggingFaceModelTrain.edit', 'Edit')}
                  </Button>
                </div>
                <div className="hugging-face-model-train__model-item">
                  <Button
                    className="hugging-face-model-train__delete-button"
                    onClick={handleDelete}
                  >
                    {t('huggingFaceModelTrain.delete', 'Delete')}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          t(
            'huggingFaceModelTrain.huggingFaceModelsNotFound',
            'Models not found'
          )
        )}
        <div className="hugging-face-model-train__item">
          <HuggingFaceModelInfo huggingFaceModel={huggingFaceModel} />
        </div>
      </div>
    </div>
  );
};

export default HuggingFaceModelTrain;
