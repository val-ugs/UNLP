import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  nlpTokenId: 0,
  nerLabelId: 0,
  initial: true,
};

const NlpTokenItem: FC<NlpTokenItemProps> = ({
  className,
  nlpToken,
  nerLabels,
}) => {
  const { t } = useTranslation();
  const [nlpTokenNerLabel, setNlpTokenNerLabel] =
    useState<NlpTokenNerLabelProps>(emptyNlpTokenNerLabel);
  const [nerLabel, setNerLabel] = useState<NerLabelProps | undefined>(
    undefined
  );
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
    if (nlpTokenNerLabelData) {
      setNlpTokenNerLabel(nlpTokenNerLabelData);
      if (nlpTokenNerLabelData.nerLabelId) {
        setNerLabel(
          nerLabels.find(
            (nerLabel) => nerLabel.id == nlpTokenNerLabelData.nerLabelId
          )
        );
      }
    }
  }, [nlpTokenNerLabelData]);

  const setNlpTokenNerLabelValue = (value: number) => {
    setNlpTokenNerLabel({
      ...nlpTokenNerLabel,
      nerLabelId: value,
    });
  };

  const nerLabelSelect: SelectProps<number> = {
    className: 'nlp-token-item__select',
    selectedValue: nlpTokenNerLabel.nerLabelId ?? 0,
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
    name: 'initial',
    checked: nlpTokenNerLabel.initial,
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
      {nlpTokenNerLabel && nerLabel && (
        <div
          className="nlp-token-item__label"
          style={{ color: nerLabel.color }}
        >
          {nlpTokenNerLabel.initial ? 'B' : 'I'}-{nerLabel.name}
        </div>
      )}
      <Button
        className="nlp-token-item__button"
        style={{ backgroundColor: nerLabel?.color }}
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
              value: t('nlpTokenItem.initial', 'Initial'),
            }}
          >
            <InputCheckbox
              className={initialInputCheckbox.className}
              name={initialInputCheckbox.name}
              checked={initialInputCheckbox.checked}
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
