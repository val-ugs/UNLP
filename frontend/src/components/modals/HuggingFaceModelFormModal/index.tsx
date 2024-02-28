import React, { FC, FormEvent, useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ContentModal from 'components/interstitial/ContentModal';
import {
  HuggingFaceModelProps,
  HuggingFaceModelType,
} from 'interfaces/huggingFaceModel.interface';
import InputButton from 'components/common/Inputs/InputButton';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import { huggingFaceModelFormModalSlice } from 'store/reducers/huggingFaceModelFormModalSlice';
import LabeledElement from 'components/interstitial/LabeledElement';
import Select, { SelectProps } from 'components/common/Select';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import InputNumber, {
  InputNumberProps,
} from 'components/common/Inputs/InputNumber';
import InputCheckbox, {
  InputCheckboxProps,
} from 'components/common/Inputs/InputCheckbox';
import './styles.scss';
import { enumToArray } from 'helpers/enumToArray';

const emptyHuggingFaceModel: HuggingFaceModelProps = {
  id: 0,
  name: '',
  modelNameOrPath: '',
  trainNlpDataset: 0,
  validNlpDataset: 0,
  evaluateMetricName: '',
  type: HuggingFaceModelType.Classification,
  trainingArgs: {
    learningRate: 0,
    perDeviceTrainBatchSize: 0,
    perDeviceEvalBatchSize: 0,
    numTrainEpochs: 0,
    weightDecay: 0,
    evaluationStrategy: '',
    saveStrategy: '',
    loadBestModelAtEnd: false,
  },
};

const HuggingFaceModelFormModal: FC = () => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [huggingFaceModel, setHuggingFaceModel] =
    useState<HuggingFaceModelProps>(emptyHuggingFaceModel);
  const [postHuggingFaceModel, {}] =
    huggingFaceModelApi.usePostHuggingFaceModelMutation();
  const [putHuggingFaceModel, {}] =
    huggingFaceModelApi.usePutHuggingFaceModelMutation();
  const { isActive, huggingFaceModel: huggingFaceModelData } = useAppSelector(
    (state) => state.huggingFaceModelFormModalReducer
  );
  const { deactivate } = huggingFaceModelFormModalSlice.actions;
  const dispatch = useAppDispatch();
  const {
    data: nlpDatasetsData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  useEffect(() => {
    if (huggingFaceModelData) setHuggingFaceModel(huggingFaceModelData);
    return () => {
      setHuggingFaceModel(emptyHuggingFaceModel);
    };
  }, [huggingFaceModelData]);

  const setNameValue = (value: string) => {
    setHuggingFaceModel({ ...huggingFaceModel, name: value });
  };
  const nameInputField: InputFieldProps = {
    className: 'hugging-face-model-form-modal__input-field',
    type: 'text',
    name: 'name',
    value: huggingFaceModel.name,
    setValue: setNameValue,
    maxLength: 20,
    disabled: false,
  };

  const setModelNameOrPathValue = (value: string) => {
    setHuggingFaceModel({ ...huggingFaceModel, modelNameOrPath: value });
  };
  const modelNameOrPathInputField: InputFieldProps = {
    className: 'hugging-face-model-form-modal__input-field',
    type: 'text',
    name: 'modelNameOrPath',
    value: huggingFaceModel.modelNameOrPath,
    setValue: setModelNameOrPathValue,
    maxLength: 20,
    disabled: false,
  };

  const setTrainNlpDatasetValue = (value: number) => {
    setHuggingFaceModel({ ...huggingFaceModel, trainNlpDataset: value });
  };
  const trainNlpDatasetSelect: SelectProps<number> = {
    className: 'hugging-face-model-form-modal__select',
    selectedValue: huggingFaceModel.trainNlpDataset ?? 0,
    setSelectedValue: setTrainNlpDatasetValue,
    children: nlpDatasets?.map((nlpDataset: NlpDatasetProps) => {
      return (
        <Select.Item key={nlpDataset.id} value={nlpDataset.id}>
          {`Dataset ${nlpDataset.id}`}
        </Select.Item>
      );
    }),
  };

  const setValidNlpDatasetValue = (value: number) => {
    setHuggingFaceModel({ ...huggingFaceModel, validNlpDataset: value });
  };
  const validNlpDatasetSelect: SelectProps<number> = {
    className: 'hugging-face-model-form-modal__select',
    selectedValue: huggingFaceModel.validNlpDataset ?? 0,
    setSelectedValue: setValidNlpDatasetValue,
    children: nlpDatasets?.map((nlpDataset: NlpDatasetProps) => {
      return (
        <Select.Item key={nlpDataset.id} value={nlpDataset.id}>
          {`Dataset ${nlpDataset.id}`}
        </Select.Item>
      );
    }),
  };

  const setEvaluateMetricNameValue = (value: string) => {
    setHuggingFaceModel({ ...huggingFaceModel, evaluateMetricName: value });
  };
  const evaluateMetricNameField: InputFieldProps = {
    className: 'hugging-face-model-form-modal__input-field',
    type: 'text',
    name: 'evaluateMetricName',
    value: huggingFaceModel.evaluateMetricName,
    setValue: setEvaluateMetricNameValue,
    maxLength: 20,
    disabled: false,
  };

  const setTypeValue = (value: string) => {
    setHuggingFaceModel({
      ...huggingFaceModel,
      type: value as HuggingFaceModelType,
    });
  };
  const typeSelect: SelectProps<string> = {
    className: 'hugging-face-model-form-modal__select',
    selectedValue: huggingFaceModel.type ?? '',
    setSelectedValue: setTypeValue,
    children: enumToArray(HuggingFaceModelType).map(
      (hfmt: HuggingFaceModelType) => {
        return (
          <Select.Item key={hfmt} value={hfmt}>
            {hfmt}
          </Select.Item>
        );
      }
    ),
  };

  const setLearningRateValue = (value: number) => {
    const trainingArgs = { ...huggingFaceModel.trainingArgs };
    trainingArgs.learningRate = value;
    setHuggingFaceModel({
      ...huggingFaceModel,
      trainingArgs: trainingArgs,
    });
  };
  const learningRateField: InputNumberProps = {
    className: 'hugging-face-model-form-modal__input-number',
    name: 'learningRate',
    value: huggingFaceModel.trainingArgs.learningRate ?? 0,
    setValue: setLearningRateValue,
    step: 0.00001,
  };

  const setPerDeviceTrainBatchSizeValue = (value: number) => {
    const trainingArgs = { ...huggingFaceModel.trainingArgs };
    trainingArgs.perDeviceTrainBatchSize = value;
    setHuggingFaceModel({
      ...huggingFaceModel,
      trainingArgs: trainingArgs,
    });
  };
  const perDeviceTrainBatchSizeField: InputNumberProps = {
    className: 'hugging-face-model-form-modal__input-number',
    name: 'perDeviceTrainBatchSize',
    value: huggingFaceModel.trainingArgs.perDeviceTrainBatchSize ?? 0,
    setValue: setPerDeviceTrainBatchSizeValue,
  };

  const setPerDeviceEvalBatchSizeValue = (value: number) => {
    const trainingArgs = { ...huggingFaceModel.trainingArgs };
    trainingArgs.perDeviceEvalBatchSize = value;
    setHuggingFaceModel({
      ...huggingFaceModel,
      trainingArgs: trainingArgs,
    });
  };
  const perDeviceEvalBatchSizeField: InputNumberProps = {
    className: 'hugging-face-model-form-modal__input-number',
    name: 'perDeviceEvalBatchSize',
    value: huggingFaceModel.trainingArgs.perDeviceEvalBatchSize ?? 0,
    setValue: setPerDeviceEvalBatchSizeValue,
  };

  const setNumTrainEpochsValue = (value: number) => {
    const trainingArgs = { ...huggingFaceModel.trainingArgs };
    trainingArgs.numTrainEpochs = value;
    setHuggingFaceModel({
      ...huggingFaceModel,
      trainingArgs: trainingArgs,
    });
  };
  const numTrainEpochsField: InputNumberProps = {
    className: 'hugging-face-model-form-modal__input-number',
    name: 'numTrainEpochs',
    value: huggingFaceModel.trainingArgs.numTrainEpochs ?? 0,
    setValue: setNumTrainEpochsValue,
  };

  const setWeightDecayValue = (value: number) => {
    const trainingArgs = { ...huggingFaceModel.trainingArgs };
    trainingArgs.weightDecay = value;
    setHuggingFaceModel({
      ...huggingFaceModel,
      trainingArgs: trainingArgs,
    });
  };
  const weightDecayField: InputNumberProps = {
    className: 'hugging-face-model-form-modal__input-number',
    name: 'weightDecay',
    value: huggingFaceModel.trainingArgs.weightDecay ?? 0,
    setValue: setWeightDecayValue,
    step: 0.01,
  };

  const setEvaluationStrategyValue = (value: string) => {
    const trainingArgs = { ...huggingFaceModel.trainingArgs };
    trainingArgs.evaluationStrategy = value;
    setHuggingFaceModel({
      ...huggingFaceModel,
      trainingArgs: trainingArgs,
    });
  };
  const evaluationStrategyField: InputFieldProps = {
    className: 'hugging-face-model-form-modal__input-field',
    type: 'text',
    name: 'evaluationStrategy',
    value: huggingFaceModel.trainingArgs.evaluationStrategy,
    setValue: setEvaluationStrategyValue,
    maxLength: 20,
    disabled: false,
  };

  const setSaveStrategyValue = (value: string) => {
    const trainingArgs = { ...huggingFaceModel.trainingArgs };
    trainingArgs.saveStrategy = value;
    setHuggingFaceModel({
      ...huggingFaceModel,
      trainingArgs: trainingArgs,
    });
  };
  const saveStrategyField: InputFieldProps = {
    className: 'hugging-face-model-form-modal__input-field',
    type: 'text',
    name: 'saveStrategy',
    value: huggingFaceModel.trainingArgs.saveStrategy,
    setValue: setSaveStrategyValue,
    maxLength: 20,
    disabled: false,
  };

  const handleLoadBestModelAtEndChange = () => {
    const trainingArgs = { ...huggingFaceModel.trainingArgs };
    trainingArgs.loadBestModelAtEnd =
      !huggingFaceModel.trainingArgs.loadBestModelAtEnd;
    setHuggingFaceModel({
      ...huggingFaceModel,
      trainingArgs: trainingArgs,
    });
  };
  const loadBestModelAtEndInputCheckbox: InputCheckboxProps = {
    className: 'hugging-face-model-form-modal__input-checkbox',
    name: '',
    defaultChecked: huggingFaceModel.trainingArgs.loadBestModelAtEnd,
    onChange: handleLoadBestModelAtEndChange,
  };

  const handleClose = () => {
    dispatch(deactivate());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    console.log(huggingFaceModel);

    try {
      if (huggingFaceModelData) {
        await putHuggingFaceModel(huggingFaceModel).unwrap();
      } else {
        await postHuggingFaceModel(huggingFaceModel).unwrap();
      }
    } catch (error) {
      console.log(error);
    }

    setHuggingFaceModel(emptyHuggingFaceModel);
    dispatch(deactivate());
  };

  return (
    <ContentModal
      className="hugging-face-model-form-modal"
      title={'Hugging face model form'}
      isActive={isActive}
      handleClose={handleClose}
    >
      <form
        className="hugging-face-model-form-modal__form"
        onSubmit={handleSubmit}
      >
        <div className="hugging-face-model-form-modal__item">Parameters:</div>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Name' }}
        >
          <InputField
            className={nameInputField.className}
            type={nameInputField.type}
            name={nameInputField.name}
            value={nameInputField.value}
            setValue={nameInputField.setValue}
            maxLength={nameInputField.maxLength}
            placeholder={nameInputField.placeholder}
            disabled={nameInputField.disabled}
            autocomplete={nameInputField.autocomplete}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Model name or path' }}
        >
          <InputField
            className={modelNameOrPathInputField.className}
            type={modelNameOrPathInputField.type}
            name={modelNameOrPathInputField.name}
            value={modelNameOrPathInputField.value}
            setValue={modelNameOrPathInputField.setValue}
            maxLength={modelNameOrPathInputField.maxLength}
            placeholder={modelNameOrPathInputField.placeholder}
            disabled={modelNameOrPathInputField.disabled}
            autocomplete={modelNameOrPathInputField.autocomplete}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Train nlp dataset' }}
        >
          <Select
            className={trainNlpDatasetSelect.className}
            selectedValue={trainNlpDatasetSelect.selectedValue}
            setSelectedValue={trainNlpDatasetSelect.setSelectedValue}
            disabled={trainNlpDatasetSelect.disabled}
          >
            {trainNlpDatasetSelect.children}
          </Select>
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Valid nlp dataset' }}
        >
          <Select
            className={validNlpDatasetSelect.className}
            selectedValue={validNlpDatasetSelect.selectedValue}
            setSelectedValue={validNlpDatasetSelect.setSelectedValue}
            disabled={validNlpDatasetSelect.disabled}
          >
            {validNlpDatasetSelect.children}
          </Select>
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Evaluate metric name' }}
        >
          <InputField
            className={evaluateMetricNameField.className}
            type={evaluateMetricNameField.type}
            name={evaluateMetricNameField.name}
            value={evaluateMetricNameField.value}
            setValue={evaluateMetricNameField.setValue}
            maxLength={evaluateMetricNameField.maxLength}
            placeholder={evaluateMetricNameField.placeholder}
            disabled={evaluateMetricNameField.disabled}
            autocomplete={evaluateMetricNameField.autocomplete}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Type' }}
        >
          <Select
            className={typeSelect.className}
            selectedValue={typeSelect.selectedValue}
            setSelectedValue={typeSelect.setSelectedValue}
            disabled={typeSelect.disabled}
          >
            {typeSelect.children}
          </Select>
        </LabeledElement>
        <div className="hugging-face-model-form-modal__item">
          Training args:
        </div>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Learning rate' }}
        >
          <InputNumber
            className={learningRateField.className}
            name={learningRateField.name}
            value={learningRateField.value}
            setValue={learningRateField.setValue}
            step={learningRateField.step}
            placeholder={learningRateField.placeholder}
            disabled={learningRateField.disabled}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Per device train batch size' }}
        >
          <InputNumber
            className={perDeviceTrainBatchSizeField.className}
            name={perDeviceTrainBatchSizeField.name}
            value={perDeviceTrainBatchSizeField.value}
            setValue={perDeviceTrainBatchSizeField.setValue}
            step={perDeviceTrainBatchSizeField.step}
            placeholder={perDeviceTrainBatchSizeField.placeholder}
            disabled={perDeviceTrainBatchSizeField.disabled}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Per device eval batch size' }}
        >
          <InputNumber
            className={perDeviceEvalBatchSizeField.className}
            name={perDeviceEvalBatchSizeField.name}
            value={perDeviceEvalBatchSizeField.value}
            setValue={perDeviceEvalBatchSizeField.setValue}
            step={perDeviceEvalBatchSizeField.step}
            placeholder={perDeviceEvalBatchSizeField.placeholder}
            disabled={perDeviceEvalBatchSizeField.disabled}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Num train epochs' }}
        >
          <InputNumber
            className={numTrainEpochsField.className}
            name={numTrainEpochsField.name}
            value={numTrainEpochsField.value}
            setValue={numTrainEpochsField.setValue}
            step={numTrainEpochsField.step}
            placeholder={numTrainEpochsField.placeholder}
            disabled={numTrainEpochsField.disabled}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Weight decay' }}
        >
          <InputNumber
            className={weightDecayField.className}
            name={weightDecayField.name}
            value={weightDecayField.value}
            setValue={weightDecayField.setValue}
            step={weightDecayField.step}
            placeholder={weightDecayField.placeholder}
            disabled={weightDecayField.disabled}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Evaluation strategy' }}
        >
          <InputField
            className={evaluationStrategyField.className}
            type={evaluationStrategyField.type}
            name={evaluationStrategyField.name}
            value={evaluationStrategyField.value}
            setValue={evaluationStrategyField.setValue}
            maxLength={evaluationStrategyField.maxLength}
            placeholder={evaluationStrategyField.placeholder}
            disabled={evaluationStrategyField.disabled}
            autocomplete={evaluationStrategyField.autocomplete}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Save strategy' }}
        >
          <InputField
            className={saveStrategyField.className}
            type={saveStrategyField.type}
            name={saveStrategyField.name}
            value={saveStrategyField.value}
            setValue={saveStrategyField.setValue}
            maxLength={saveStrategyField.maxLength}
            placeholder={saveStrategyField.placeholder}
            disabled={saveStrategyField.disabled}
            autocomplete={saveStrategyField.autocomplete}
          />
        </LabeledElement>
        <LabeledElement
          className="hugging-face-model-form-modal__item"
          labelElement={{ value: 'Load best model at end' }}
        >
          <InputCheckbox
            className={loadBestModelAtEndInputCheckbox.className}
            name={loadBestModelAtEndInputCheckbox.name}
            defaultChecked={loadBestModelAtEndInputCheckbox.defaultChecked}
            onChange={loadBestModelAtEndInputCheckbox.onChange}
          />
        </LabeledElement>
        <InputButton className="hugging-face-model-form-modal__button">
          Confirm
        </InputButton>
      </form>
    </ContentModal>
  );
};

export default HuggingFaceModelFormModal;
