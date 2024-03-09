import React, { FC, useState } from 'react';
import Button from 'components/common/Button';
import Dropdown from 'components/common/Dropdown';
import { ActionProps } from 'interfaces/action.interface';
import { listOfActions } from 'data/listOfActions';
import './styles.scss';

interface AddAction {
  className?: string;
  actions: ActionProps[];
  setActions: React.Dispatch<React.SetStateAction<ActionProps[]>>;
}

const AddAction: FC<AddAction> = ({ className, actions, setActions }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`add-action ${className}`}>
      <Button className="add-action__button" onClick={handleOpen}>
        +
      </Button>
      <Dropdown
        className="add-action__dropdown"
        contentClassName="add-action__dropdown-content"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        {listOfActions.map((action: ActionProps) => (
          <Button
            className="add-action__item"
            onClick={() => {
              setActions([...actions, action]);
              setIsOpen(false);
            }}
            key={action.name}
          >
            {action.name}
          </Button>
        ))}
      </Dropdown>
    </div>
  );
};

export default AddAction;
