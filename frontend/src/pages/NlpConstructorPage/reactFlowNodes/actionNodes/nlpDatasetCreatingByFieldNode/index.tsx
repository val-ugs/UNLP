import React, { FC, useEffect, useState } from 'react';
import { useAppDispatch } from 'hooks/redux';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import { fieldType } from 'data/enums/fieldType';
import { enumToArray } from 'helpers/enumToArray';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import './styles.scss';
import { createNlpDatasetByFieldDtoProps } from 'interfaces/dtos/createNlpDatasetByFieldDto.interface';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import { nerLabelApi } from 'services/nerLabelService';
import { skipToken } from '@reduxjs/toolkit/query';
import InputCheckbox, {
  InputCheckboxProps,
} from 'components/common/Inputs/InputCheckbox';

interface NlpDatasetCreatingByFieldNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
    createNlpDatasetByFieldDto: createNlpDatasetByFieldDtoProps;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const NlpDatasetCreatingByFieldNode: FC<
  NodeProps<NlpDatasetCreatingByFieldNodeProps>
> = (node) => {
  const [nerLabels, setNerLabels] = useState<NerLabelProps[]>([]);
  const { editNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();
  const {
    data: nerLabelsData,
    error: nerLabelError,
    isLoading: nerLabelLoading,
    isError: isNerLabelError,
  } = nerLabelApi.useGetNerLabelsByNlpDatasetIdQuery(
    node.data?.input?.nlpDataset?.id ?? skipToken
  );

  const inputHandles: InputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  const outputHandles: OutputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  const setFieldValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            createNlpDatasetByFieldDto: {
              ...node.data?.input?.createNlpDatasetByFieldDto,
              field: value as fieldType,
            },
          },
        },
      })
    );
  };
  const fieldSelect: SelectProps<string> = {
    className: 'nlp-dataset-creating-by-field-node__select nodrag nowheel',
    selectedValue: node.data?.input?.createNlpDatasetByFieldDto?.field ?? '',
    setSelectedValue: setFieldValue,
    children: enumToArray(fieldType).map((ft: fieldType) => {
      return (
        <Select.Item key={ft} value={ft}>
          {ft}
        </Select.Item>
      );
    }),
  };

  const setNerLabelIdValue = (value: number) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            createNlpDatasetByFieldDto: {
              ...node.data?.input?.createNlpDatasetByFieldDto,
              nerLabelId: value,
            },
          },
        },
      })
    );
  };
  const nerLabelSelect: SelectProps<number> = {
    className: 'nlp-dataset-creating-by-field-node__select nodrag nowheel',
    selectedValue:
      node.data?.input?.createNlpDatasetByFieldDto?.nerLabelId ?? 0,
    setSelectedValue: setNerLabelIdValue,
    children: nerLabels?.map((nerLabel: NerLabelProps) => {
      return (
        <Select.Item key={nerLabel.id} value={nerLabel.id}>
          {`${nerLabel.name}`}
        </Select.Item>
      );
    }),
  };

  const handleClassificationLabelSavedChange = () => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            createNlpDatasetByFieldDto: {
              ...node.data?.input?.createNlpDatasetByFieldDto,
              isClassificationLabelSaved:
                !node.data?.input?.createNlpDatasetByFieldDto
                  ?.isClassificationLabelSaved,
            },
          },
        },
      })
    );
  };
  const classificationLabelSavedInputCheckbox: InputCheckboxProps = {
    className: 'nlp-dataset-creating-by-field-node__input-checkbox',
    name: 'classificationLabelSaved',
    checked:
      node.data?.input?.createNlpDatasetByFieldDto
        ?.isClassificationLabelSaved ?? false,
    onChange: handleClassificationLabelSavedChange,
  };
  const handleSummarizationSavedChange = () => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            createNlpDatasetByFieldDto: {
              ...node.data?.input?.createNlpDatasetByFieldDto,
              isSummarizationSaved:
                !node.data?.input?.createNlpDatasetByFieldDto
                  .isSummarizationSaved,
            },
          },
        },
      })
    );
  };
  const summarizationSavedInputCheckbox: InputCheckboxProps = {
    className: 'nlp-dataset-creating-by-field-node__input-checkbox',
    name: 'summarizationSaved',
    checked:
      node.data?.input?.createNlpDatasetByFieldDto?.isSummarizationSaved ??
      false,
    onChange: handleSummarizationSavedChange,
  };

  useEffect(() => {
    if (
      node.data?.input?.createNlpDatasetByFieldDto?.field ==
        fieldType.NerLabel &&
      nerLabelsData
    )
      setNerLabels(nerLabelsData);
    if (isNerLabelError) setNerLabels([]);
  }, [
    node.data?.input?.createNlpDatasetByFieldDto?.field,
    isNerLabelError,
    nerLabelsData,
  ]);

  return (
    <BaseNode
      className="nlp-dataset-creating-by-field-node"
      inputHandles={inputHandles}
      outputHandles={outputHandles}
      running={node.data?.running}
    >
      <div className="nlp-dataset-creating-by-field-node__main">
        <LabeledElement
          className="nlp-dataset-creating-by-field-node__labeled-element"
          labelElement={{ value: 'Select field' }}
        >
          <Select
            className={fieldSelect.className}
            selectedValue={fieldSelect.selectedValue}
            setSelectedValue={fieldSelect.setSelectedValue}
            disabled={fieldSelect.disabled}
          >
            {fieldSelect.children}
          </Select>
        </LabeledElement>
      </div>
      {node.data?.input?.createNlpDatasetByFieldDto.field ==
        fieldType.NerLabel && (
        <div className="nlp-dataset-creating-by-field-node__main">
          <LabeledElement
            className="nlp-dataset-creating-by-field-node__labeled-element"
            labelElement={{ value: 'Select ner label' }}
          >
            <Select
              className={nerLabelSelect.className}
              selectedValue={nerLabelSelect.selectedValue}
              setSelectedValue={nerLabelSelect.setSelectedValue}
              disabled={nerLabelSelect.disabled}
            >
              {nerLabelSelect.children}
            </Select>
          </LabeledElement>
        </div>
      )}
      <div className="nlp-dataset-creating-by-field-node__input-checkbox">
        <LabeledElement
          className="nlp-dataset-creating-by-field-node__labeled-element"
          labelElement={{ value: 'Is classification label saved' }}
        >
          <InputCheckbox
            className={classificationLabelSavedInputCheckbox.className}
            name={classificationLabelSavedInputCheckbox.name}
            checked={classificationLabelSavedInputCheckbox.checked}
            onChange={classificationLabelSavedInputCheckbox.onChange}
          />
        </LabeledElement>
      </div>
      <div className="nlp-dataset-creating-by-field-node__input-checkbox">
        <LabeledElement
          className="nlp-dataset-creating-by-field-node__labeled-element"
          labelElement={{ value: 'Is summarization saved' }}
        >
          <InputCheckbox
            className={summarizationSavedInputCheckbox.className}
            name={summarizationSavedInputCheckbox.name}
            checked={summarizationSavedInputCheckbox.checked}
            onChange={summarizationSavedInputCheckbox.onChange}
          />
        </LabeledElement>
      </div>
      {nerLabels.length == 0 &&
        node.data?.input?.createNlpDatasetByFieldDto.field ==
          fieldType.NerLabel && (
          <div className="nlp-dataset-creating-by-field-node__warning">
            Warning: Ner labels not found. Dataset not loaded. Try run program.
          </div>
        )}
    </BaseNode>
  );
};

export default NlpDatasetCreatingByFieldNode;
