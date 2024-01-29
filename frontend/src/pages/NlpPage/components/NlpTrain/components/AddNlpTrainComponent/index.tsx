import React, { FC, useState } from 'react';
import Button from 'components/common/Button';
import Dropdown from 'components/common/Dropdown';
import { NlpTrainComponentProps } from 'interfaces/nlpTrainComponent.interface';
import { listOfNlpTrainComponents } from 'data/listOfNlpTrainComponents';
import './styles.scss';

interface AddNlpTrainComponentProps {
  className?: string;
  nlpTrainComponents: NlpTrainComponentProps[];
  setNlpTrainComponents: React.Dispatch<
    React.SetStateAction<NlpTrainComponentProps[]>
  >;
}

const AddNlpTrainComponent: FC<AddNlpTrainComponentProps> = ({
  className,
  nlpTrainComponents,
  setNlpTrainComponents,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`add-nlp-train-component ${className}`}>
      <Button className="add-nlp-train-component__button" onClick={handleOpen}>
        +
      </Button>
      <Dropdown
        className="add-nlp-train-component__dropdown"
        contentClassName="add-nlp-train-component__dropdown-content"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        {listOfNlpTrainComponents.map((nlpTrainComponent) => (
          <Button
            className="add-nlp-train-component__item"
            onClick={() => {
              setNlpTrainComponents([...nlpTrainComponents, nlpTrainComponent]);
              setIsOpen(false);
            }}
            key={nlpTrainComponent.id}
          >
            {nlpTrainComponent.name}
          </Button>
        ))}
      </Dropdown>
    </div>
  );
};

export default AddNlpTrainComponent;
