import React, { FC, useState } from 'react';
import Button from 'components/common/Button';
import Dropdown from 'components/common/Dropdown';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import { useAppDispatch } from 'hooks/redux';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { loadDataModalSlice } from 'store/reducers/loadDataModalSlice';
import { listOfActions } from 'data/listOfActions';
import { ActionProps } from 'interfaces/action.interface';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import './styles.scss';

export interface MenuProps {
  className: string;
  nlpDataset: NlpDatasetProps | undefined;
}

const Menu: FC<MenuProps> = ({ className, nlpDataset }) => {
  const [isActionOpen, setIsActionOpen] = useState<boolean>(false);
  const [downloadNlpDataset, {}] =
    nlpDatasetApi.useDownloadNlpDatasetMutation();
  const { activate: activateLoadData } = loadDataModalSlice.actions;
  const { activate: activateAction } = actionModalSlice.actions;
  const dispatch = useAppDispatch();

  const handleLoadData = () => dispatch(activateLoadData());

  const handleSaveData = () => {
    if (nlpDataset) {
      downloadNlpDataset(nlpDataset.id)
        .unwrap()
        .then((data) => {
          // create file link in browser's memory
          const href = URL.createObjectURL(
            new Blob([data], { type: 'application/json' })
          );
          const link = document.createElement('a');
          link.href = href;
          link.setAttribute('download', 'dataset.json');
          document.body.appendChild(link);
          link.click();

          // clean up and remove ObjectURL
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        });
    }
  };

  const handleOpenAction = () => setIsActionOpen(true);

  return (
    <div className={`menu ${className}`}>
      <Button className="menu__item menu__button" onClick={handleLoadData}>
        Load data
      </Button>
      <Button className="menu__item menu__button" onClick={handleSaveData}>
        Save data
      </Button>
      <div className="menu__item menu__actions">
        <Button className="menu__button" onClick={handleOpenAction}>
          Actions
        </Button>
        <Dropdown
          className="menu__actions-dropdown"
          isOpen={isActionOpen}
          setIsOpen={setIsActionOpen}
        >
          {listOfActions.map((action: ActionProps) => (
            <div className="menu__actions-item" key={action.name}>
              <Button
                className="menu__actions-button"
                onClick={() => dispatch(activateAction(action.name))}
              >
                {action.name}
              </Button>
            </div>
          ))}
        </Dropdown>
      </div>
    </div>
  );
};

export default Menu;
