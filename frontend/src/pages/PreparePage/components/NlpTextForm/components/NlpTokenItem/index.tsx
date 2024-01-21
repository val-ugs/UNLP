import React, { FC, useState } from 'react';
import Button from 'components/common/Button';
import './styles.scss';
import Dropdown from 'components/common/Dropdown';
import { NlpTokenProps } from 'interfaces/nlpToken.interface';
import Select, { SelectProps } from 'components/common/Select';
import { NerLabelProps } from 'interfaces/nerLabel.interface';

export interface NlpTokenItemProps {
  className: string;
  nlpToken: NlpTokenProps;
  nerLabels: NerLabelProps[];
}

const NlpTokenItem: FC<NlpTokenItemProps> = ({
  className,
  nlpToken,
  nerLabels,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const setNerLabel = (value: number) => {};

  const nerLabelSelect: SelectProps<number> = {
    className: `nlp-token-item__field-input`,
    selectedValue: nlpToken.nlpTokenNerLabel?.nerLabel?.id ?? 0,
    setSelectedValue: setNerLabel,
    children: nerLabels.map((label: NerLabelProps) => {
      return (
        <Select.Item key={label.id} value={label.id}>
          {label.name}
        </Select.Item>
      );
    }),
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`nlp-token-item ${className}`}>
      <div
        className="nlp-token-item__label"
        style={{ color: nlpToken.nlpTokenNerLabel?.nerLabel?.color }}
      >
        {nlpToken.nlpTokenNerLabel?.nerLabel?.name}
      </div>
      <Button
        className="nlp-token-item__button"
        style={{ color: nlpToken.nlpTokenNerLabel?.nerLabel?.color }}
        onClick={handleClick}
      >
        {nlpToken.token}
      </Button>
      <Dropdown className="nlp-token-item__dropdown" isOpen={isOpen}>
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
