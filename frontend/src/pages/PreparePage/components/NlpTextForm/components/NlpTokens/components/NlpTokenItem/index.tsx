import React, { FC, useEffect, useState } from 'react';
import camelize from 'camelize';
import Button from 'components/common/Button';
import Dropdown from 'components/common/Dropdown';
import { NlpTokenProps } from 'interfaces/nlpToken.interface';
import Select, { SelectProps } from 'components/common/Select';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import { NlpTokenNerLabelProps } from 'interfaces/nlpTokenNerLabel.interface';
import { nlpTokenNerLabelApi } from 'services/nlpTokenNerLabelService';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputCheckbox, {
  InputCheckboxProps,
} from 'components/common/Inputs/InputCheckbox';
import './styles.scss';

export interface NlpTokenItemProps {
  className: string;
  nlpToken: NlpTokenProps;
  nerLabels: NerLabelProps[];
}

const emptyNlpTokenNerLabel: NlpTokenNerLabelProps = {
  id: 0,
  nerLabel: undefined,
  initial: true,
};

const NlpTokenItem: FC<NlpTokenItemProps> = ({
  className,
  nlpToken,
  nerLabels,
}) => {
  const [nlpTokenNerLabel, setNlpTokenNerLabel] =
    useState<NlpTokenNerLabelProps>(emptyNlpTokenNerLabel);
  const {
    data: nlpTokenNerLabelData,
    error,
    isLoading,
  } = nlpTokenNerLabelApi.useGetNlpTokenNerLabelByNlpTokenIdQuery(
    Number(nlpToken.id)
  );
  const [postNlpTokenNerLabel, {}] =
    nlpTokenNerLabelApi.usePostNlpTokenNerLabelMutation();
  const [updateNlpTokenNerLabel, {}] =
    nlpTokenNerLabelApi.usePutNlpTokenNerLabelMutation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (nlpTokenNerLabelData) setNlpTokenNerLabel(nlpTokenNerLabelData);
  }, [nlpTokenNerLabelData]);

  const setNlpTokenNerLabelValue = (value: number) => {
    setNlpTokenNerLabel({
      ...nlpTokenNerLabel,
      nerLabel: nerLabels.find((nerLabel) => nerLabel.id == value),
    });
  };

  const nerLabelSelect: SelectProps<number> = {
    className: 'nlp-token-item__select',
    selectedValue: nlpTokenNerLabel.nerLabel?.id ?? 0,
    setSelectedValue: setNlpTokenNerLabelValue,
    children: nerLabels?.map((label: NerLabelProps) => {
      return (
        <Select.Item key={label.id} value={label.id}>
          {label.name}
        </Select.Item>
      );
    }),
  };

  const handleInitialChange = () => {
    setNlpTokenNerLabel({
      ...nlpTokenNerLabel,
      initial: !nlpTokenNerLabel.initial,
    });
  };
  const initialInputCheckbox: InputCheckboxProps = {
    className: 'nlp-token-item__input-checkbox',
    name: 'initial-input-checkbox',
    defaultChecked: nlpTokenNerLabel.initial,
    onChange: handleInitialChange,
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    if (nlpTokenNerLabel) {
      if (nlpTokenNerLabel.nlpTokenId) {
        updateNlpTokenNerLabel(nlpTokenNerLabel);
      } else {
        postNlpTokenNerLabel({ nlpTokenId: nlpToken.id, nlpTokenNerLabel });
      }
    }
  };

  return (
    <div className={`nlp-token-item ${className}`}>
      {nlpTokenNerLabel && nlpTokenNerLabel.nerLabel && (
        <div
          className="nlp-token-item__label"
          style={{ color: nlpTokenNerLabel.nerLabel.color }}
        >
          {nlpTokenNerLabel.initial ? 'B' : 'I'}-
          {nlpTokenNerLabel.nerLabel.name}
        </div>
      )}
      <Button
        className="nlp-token-item__button"
        style={{ backgroundColor: nlpTokenNerLabel?.nerLabel?.color }}
        onClick={handleClick}
      >
        {nlpToken.token}
      </Button>
      <Dropdown
        className="nlp-token-item__dropdown"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={handleClose}
      >
        <form className="nlp-token-item__dropdown-form">
          <LabeledElement
            className="nlp-token-item__labeled-element"
            labelElement={{
              htmlFor: initialInputCheckbox.name,
              value: 'Initial',
            }}
          >
            <InputCheckbox
              className={initialInputCheckbox.className}
              name={initialInputCheckbox.name}
              defaultChecked={initialInputCheckbox.defaultChecked}
              onChange={initialInputCheckbox.onChange}
            />
          </LabeledElement>
        </form>
        <Select
          className={nerLabelSelect.className}
          selectedValue={nerLabelSelect.selectedValue}
          setSelectedValue={nerLabelSelect.setSelectedValue}
          disabled={nerLabelSelect.disabled}
        >
          {nerLabelSelect.children}
        </Select>
      </Dropdown>
    </div>
  );
};

export default NlpTokenItem;
