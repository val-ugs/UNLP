import React, { FC, FormEvent, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import ContentModal from 'components/interstitial/ContentModal';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import InputButton from 'components/common/Inputs/InputButton';
import { nerLabelApi } from 'services/nerLabelService';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import { nerLabelFormModalSlice } from 'store/reducers/nerLabelFormModalSlice';
import LabeledElement from 'components/interstitial/LabeledElement';
import './styles.scss';

export interface NerLabelFromModalProps {
  className?: string;
}

const emptyNerLabel: NerLabelProps = {
  id: 0,
  name: '',
  color: '#000000',
};

const NerLabelFormModal: FC<NerLabelFromModalProps> = ({ className }) => {
  const [nerLabel, setNerLabel] = React.useState<NerLabelProps>(emptyNerLabel);
  const [postNerLabel, {}] = nerLabelApi.usePostNerLabelMutation();
  const [putNerLabel, {}] = nerLabelApi.usePutNerLabelMutation();
  const {
    isActive,
    nlpDatasetId,
    nerLabel: nerLabelData,
  } = useAppSelector((state) => state.nerLabelFormModalReducer);
  const { deactivate } = nerLabelFormModalSlice.actions;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (nerLabelData) setNerLabel(nerLabelData);
    return () => {
      setNerLabel(emptyNerLabel);
    };
  }, [nerLabelData]);

  useEffect(() => {}, []);

  const setNerLabelNameValue = (value: string) => {
    setNerLabel({ ...nerLabel, name: value });
  };
  const labelInputField: InputFieldProps = {
    className: 'ner-label-form__input-field',
    type: 'text',
    name: 'pattern',
    value: nerLabel.name,
    setValue: setNerLabelNameValue,
    maxLength: 20,
    disabled: false,
  };

  const setNerLabelColor = (value: string) => {
    setNerLabel({ ...nerLabel, color: value });
  };

  const handleClose = () => {
    dispatch(deactivate());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (nerLabelData) {
        await putNerLabel(nerLabel).unwrap();
      } else {
        await postNerLabel({ nlpDatasetId, nerLabel }).unwrap();
      }
    } catch (error) {
      console.log(error);
    }

    setNerLabel(emptyNerLabel);
    dispatch(deactivate());
  };

  return (
    <ContentModal
      className={`ner-label-form-modal ${className}`}
      title={'Ner label form'}
      isActive={isActive}
      handleClose={handleClose}
    >
      <form className="ner-label-form-modal__form" onSubmit={handleSubmit}>
        <LabeledElement
          className="ner-label-form-modal__item"
          labelElement={{ value: 'Label name' }}
        >
          <InputField
            className={labelInputField.className}
            type={labelInputField.type}
            name={labelInputField.name}
            value={labelInputField.value}
            setValue={labelInputField.setValue}
            maxLength={labelInputField.maxLength}
            placeholder={labelInputField.placeholder}
            disabled={labelInputField.disabled}
            autocomplete={labelInputField.autocomplete}
          />
        </LabeledElement>
        <LabeledElement
          className="ner-label-form-modal__item"
          labelElement={{ value: 'Label color' }}
        >
          <div className="ner-label-form-modal__input-color-picker">
            <HexColorPicker
              color={nerLabel.color}
              onChange={setNerLabelColor}
            />
          </div>
        </LabeledElement>
        <InputButton className="ner-label-form-modal__button">
          Confirm
        </InputButton>
      </form>
    </ContentModal>
  );
};

export default NerLabelFormModal;