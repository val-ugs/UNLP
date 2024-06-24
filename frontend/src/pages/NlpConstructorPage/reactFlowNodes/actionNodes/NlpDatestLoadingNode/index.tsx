import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import { useAppDispatch } from 'hooks/redux';
import './styles.scss';

interface NlpDatasetLoadingNodeProps {
  input: {
    filePath: string;
    textPatternToSplit: string;
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const NlpDatasetLoadingNode: FC<NodeProps<NlpDatasetLoadingNodeProps>> = (
  node
) => {
  const { t } = useTranslation();
  const { editNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();

  const inputHandles: InputHandlesItemProps[] = [];

  const outputHandles: OutputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  const setFilePathValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            filePath: value,
          },
        },
      })
    );
  };
  const filePathInputField: InputFieldProps = {
    className: 'nlp-dataset-loading-node__input-field nodrag nowheel',
    type: 'text',
    name: 'filePath',
    value: node.data?.input?.filePath ?? '',
    setValue: setFilePathValue,
    maxLength: 500,
    disabled: false,
  };

  const setTextPatternToSplitValue = (value: string) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            textPatternToSplit: value,
          },
        },
      })
    );
  };
  const textPatternToSplitInputField: InputFieldProps = {
    className: 'nlp-dataset-loading-node__input-field nodrag nowheel',
    type: 'text',
    name: 'textPatternToSplit',
    value: node.data?.input?.textPatternToSplit ?? '',
    setValue: setTextPatternToSplitValue,
    maxLength: 30,
    disabled: false,
  };

  return (
    <BaseNode
      className="nlp-dataset-loading-node"
      inputHandles={inputHandles}
      outputHandles={outputHandles}
      running={node.data?.running}
    >
      <div className="nlp-dataset-loading-node__main">
        <div className="nlp-dataset-loading-node__main-title">
          {t('nlpDatasetLoadingNode.loadNlpDataset', 'Load dataset')}
        </div>
        <div className="nlp-dataset-loading-node__item">
          <LabeledElement
            className="nlp-dataset-loading-node__labeled-element"
            labelElement={{
              value: t('nlpDatasetLoadingNode.inputFilePath', 'File path'),
            }}
          >
            <InputField
              className={filePathInputField.className}
              type={filePathInputField.type}
              name={filePathInputField.name}
              value={filePathInputField.value}
              setValue={filePathInputField.setValue}
              maxLength={filePathInputField.maxLength}
              placeholder={filePathInputField.placeholder}
              disabled={filePathInputField.disabled}
              autocomplete={filePathInputField.autocomplete}
            />
          </LabeledElement>
        </div>
        <div className="nlp-dataset-creating-by-template-node__item">
          <LabeledElement
            className="nlp-dataset-creating-by-template-node__labeled-element"
            labelElement={{
              value: t(
                'nlpDatasetLoadingNode.inputTextPatternToSplit',
                'Regex text pattern to split'
              ),
            }}
          >
            <InputField
              className={textPatternToSplitInputField.className}
              type={textPatternToSplitInputField.type}
              name={textPatternToSplitInputField.name}
              value={textPatternToSplitInputField.value}
              setValue={textPatternToSplitInputField.setValue}
              maxLength={textPatternToSplitInputField.maxLength}
              placeholder={textPatternToSplitInputField.placeholder}
              disabled={textPatternToSplitInputField.disabled}
              autocomplete={textPatternToSplitInputField.autocomplete}
            />
          </LabeledElement>
        </div>
      </div>
    </BaseNode>
  );
};

export default NlpDatasetLoadingNode;
