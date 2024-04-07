import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import { NodeProps } from 'reactflow';
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
import BaseNode from '../../_common/BaseNode';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import './styles.scss';

interface HuggingFaceModelNodeProps {
  input: {
    huggingFaceModel: HuggingFaceModelProps;
  };
  output: {
    huggingFaceModel: HuggingFaceModelProps;
  };
  running: boolean;
}

const HuggingFaceModelNode: FC<NodeProps<HuggingFaceModelNodeProps>> = (
  node
) => {
  const { editNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();
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
    if (huggingFaceModel)
      dispatch(
        editNode({
          id: node.id,
          newData: {
            input: { huggingFaceModel: huggingFaceModel },
          },
        })
      );
  };
  const huggingFaceModelSelect: SelectProps<number> = {
    className: 'hugging-face-model-node__select nodrag nowheel',
    selectedValue: node.data?.input?.huggingFaceModel?.id ?? 0,
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

  const outputHandles: OutputHandlesItemProps[] = [
    {
      id: 'huggingFaceModel',
    },
  ];

  return (
    <BaseNode
      className="hugging-face-model-node nopan"
      outputHandles={outputHandles}
      running={node.data?.running}
    >
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
                      dispatch(
                        editNode({
                          id: node.id,
                          newData: {
                            output: { huggingFaceModel: null },
                          },
                        })
                      );
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
            </>
          ) : (
            'Hugging face models not found'
          )}
        </div>
      </div>
    </BaseNode>
  );
};

export default HuggingFaceModelNode;
