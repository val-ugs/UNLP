import React, { FC, useState } from 'react';
import Button from 'components/common/Button';
import Dropdown from 'components/common/Dropdown';
import { NlpComponentProps } from 'interfaces/nlpComponent.interface';
import { listOfNlpComponents } from 'data/listOfNlpTrainComponents';
import './styles.scss';

interface AddNlpComponentProps {
  className?: string;
  nlpComponents: NlpComponentProps[];
  setNlpComponents: React.Dispatch<React.SetStateAction<NlpComponentProps[]>>;
}

const AddNlpComponent: FC<AddNlpComponentProps> = ({
  className,
  nlpComponents,
  setNlpComponents,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`add-nlp-component ${className}`}>
      <Button className="add-nlp-component__button" onClick={handleOpen}>
        +
      </Button>
      <Dropdown
        className="add-nlp-component__dropdown"
        contentClassName="add-nlp-component__dropdown-content"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        {listOfNlpComponents.map((nlpComponent) => (
          <Button
            className="add-nlp-component__item"
            onClick={() => {
              setNlpComponents([...nlpComponents, nlpComponent]);
              setIsOpen(false);
            }}
            key={nlpComponent.id}
          >
            {nlpComponent.name}
          </Button>
        ))}
      </Dropdown>
    </div>
  );
};

export default AddNlpComponent;
