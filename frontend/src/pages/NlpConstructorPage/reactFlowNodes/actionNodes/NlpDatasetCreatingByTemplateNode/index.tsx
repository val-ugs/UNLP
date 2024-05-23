import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import LabeledElement from 'components/interstitial/LabeledElement';
import TextareaField, {
  TextareaFieldProps,
} from 'components/common/Inputs/TextareaField';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import { useAppDispatch } from 'hooks/redux';
import './styles.scss';

interface NlpDatasetCreatingByTemplateNodeProps {
  input: {
    nlpDatasets: NlpDatasetProps;
    template: string;
    delimiter: string;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const NlpDatasetCreatingByTemplateNode: FC<
  NodeProps<NlpDatasetCreatingByTemplateNodeProps>
> = (node) => {
  const { t } = useTranslation();
  const { editNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();

  const inputHandles: InputHandlesItemProps[] = [
    {
      id: 'nlpDataset1',
    },
    {
      id: 'nlpDataset2',
    },
  ];

  const outputHandles: OutputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  const setTemplateValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            template: value,
          },
        },
      })
    );
  };
  const templateTextareaField: TextareaFieldProps = {
    className: 'nlp-dataset-creating-by-template-node__textarea-field',
    name: 'template',
    value: node.data?.input?.template ?? '',
    setValue: setTemplateValue,
    maxLength: 500,
  };

  const setDelimiterValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            delimiter: value,
          },
        },
      })
    );
  };
  const delimiterInputField: InputFieldProps = {
    className:
      'nlp-dataset-creating-by-template-node__input-field nodrag nowheel',
    type: 'text',
    name: 'delimiter',
    value: node.data?.input?.delimiter ?? '',
    setValue: setDelimiterValue,
    maxLength: 1,
    disabled: false,
  };

  return (
    <BaseNode
      className="nlp-dataset-creating-by-template-node"
      inputHandles={inputHandles}
      outputHandles={outputHandles}
      running={node.data?.running}
    >
      <div className="nlp-dataset-creating-by-template-node__main">
        <div className="nlp-dataset-creating-by-template-node__main-title">
          {t(
            'nlpDatasetCreatingByTemplateNode.createNlpDatasetByTemplate',
            'Create dataset by template'
          )}
        </div>
        <div className="nlp-dataset-creating-by-template-node__item">
          <LabeledElement
            className="nlp-dataset-creating-by-template-node__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetCreatingByTemplateNode.inputTemplate',
                'Input template'
              ),
            }}
          >
            <TextareaField
              className={templateTextareaField.className}
              name={templateTextareaField.name}
              form={templateTextareaField.form}
              value={templateTextareaField.value}
              setValue={templateTextareaField.setValue}
              rows={templateTextareaField.rows}
              maxLength={templateTextareaField.maxLength}
              placeholder={templateTextareaField.placeholder}
              disabled={templateTextareaField.disabled}
              readonly={templateTextareaField.readonly}
            />
          </LabeledElement>
        </div>
        <div className="nlp-dataset-creating-by-template-node__item">
          <LabeledElement
            className="nlp-dataset-creating-by-template-node__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetCreatingByTemplateNode.inputDelimiter',
                'Input delimiter'
              ),
            }}
          >
            <InputField
              className={delimiterInputField.className}
              type={delimiterInputField.type}
              name={delimiterInputField.name}
              value={delimiterInputField.value}
              setValue={delimiterInputField.setValue}
              maxLength={delimiterInputField.maxLength}
              placeholder={delimiterInputField.placeholder}
              disabled={delimiterInputField.disabled}
              autocomplete={delimiterInputField.autocomplete}
            />
          </LabeledElement>
        </div>
      </div>
    </BaseNode>
  );
};

export default NlpDatasetCreatingByTemplateNode;
