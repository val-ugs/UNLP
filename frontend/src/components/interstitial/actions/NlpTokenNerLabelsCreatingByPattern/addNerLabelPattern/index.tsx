import React, { FC, useState, MouseEvent } from 'react';
import Select, { SelectProps } from 'components/common/Select';
import LabeledElement from 'components/interstitial/LabeledElement';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import InputField, {
  InputFieldProps,
} from 'components/common/Inputs/InputField';
import Button from 'components/common/Button';
import { nerLabelPattern } from 'interfaces/dtos/createNlpTokenNerLabelsByPatternDto';
import './styles.scss';

interface AddNerLabelPatternProps {
  className?: string;
  nerLabels: NerLabelProps[];
  handleAddNerLabelPattern: ({ nerLabel, pattern }: nerLabelPattern) => void;
}

const AddNerLabelPattern: FC<AddNerLabelPatternProps> = ({
  className,
  nerLabels,
  handleAddNerLabelPattern,
}) => {
  const [nerLabelId, setNerLabelId] = useState<number>();
  const [pattern, setPattern] = useState<string>();

  const setNerLabelIdValue = (value: number) => {
    setNerLabelId(value);
  };
  const nerLabelSelect: SelectProps<number> = {
    className: 'ner-label-pattern__select nodrag nowheel',
    selectedValue: nerLabelId ?? 0,
    setSelectedValue: setNerLabelIdValue,
    children: nerLabels?.map((nerLabel: NerLabelProps) => {
      return (
        <Select.Item key={nerLabel.id} value={nerLabel.id}>
          {nerLabel.name}
        </Select.Item>
      );
    }),
  };

  const setPatternValue = (value: string) => {
    setPattern(value);
  };
  const patternInputField: InputFieldProps = {
    className: 'ner-label-pattern__input-field nodrag nowheel',
    type: 'text',
    name: 'pattern',
    value: pattern ?? '',
    setValue: setPatternValue,
    maxLength: 500,
    disabled: false,
  };

  const handleAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (nerLabelId && pattern) {
      const nerLabel = nerLabels.find((nerLabel) => nerLabel.id === nerLabelId);
      if (nerLabel) handleAddNerLabelPattern({ nerLabel, pattern });
    }
  };

  return (
    <div className={`ner-label-pattern ${className}`}>
      <div className="ner-label-pattern__item">
        <LabeledElement
          className="ner-label-pattern__labeled-element"
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
        <LabeledElement
          className="ner-label-pattern__labeled-element"
          labelElement={{ value: 'Enter regex pattern' }}
        >
          <InputField
            className={patternInputField.className}
            type={patternInputField.type}
            name={patternInputField.name}
            value={patternInputField.value}
            setValue={patternInputField.setValue}
            maxLength={patternInputField.maxLength}
            placeholder={patternInputField.placeholder}
            disabled={patternInputField.disabled}
            autocomplete={patternInputField.autocomplete}
          />
        </LabeledElement>
      </div>
      <div className="ner-label-pattern__item ner-label-pattern__item-button">
        <Button className="ner-label-pattern__button" onClick={handleAdd}>
          Add
        </Button>
      </div>
    </div>
  );
};

export default AddNerLabelPattern;
