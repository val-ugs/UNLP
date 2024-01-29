import React, { FC, ReactNode, useState } from 'react';
import Button from 'components/common/Button';
import AddNlpTrainComponent from './components/AddNlpTrainComponent';
import './styles.scss';

interface NlpTrainComponentProps {
  id: number;
  name: string;
  component: ReactNode;
}

const NlpTrain: FC = () => {
  const [nlpTrainComponents, setNlpTrainComponents] = useState<
    NlpTrainComponentProps[]
  >([]);
  const [selectedNlpTrainComponent, setSelectedNlpTrainComponent] = useState<
    NlpTrainComponentProps | undefined
  >(undefined);

  return (
    <div className="nlp-train">
      <div className="nlp-train__sidebar">
        <div className="nlp-train__title">Train:</div>
        <div className="nlp-train__list">
          {nlpTrainComponents?.map(
            (nlpComponent: NlpTrainComponentProps, index: number) => (
              <Button
                className="nlp-train__item"
                onClick={() => {
                  setSelectedNlpTrainComponent(nlpComponent);
                }}
                key={nlpComponent.id}
              >
                {index + 1}. {nlpComponent.name}
              </Button>
            )
          )}
          <AddNlpTrainComponent
            className="nlp-train__item"
            nlpTrainComponents={nlpTrainComponents}
            setNlpTrainComponents={setNlpTrainComponents}
          />
        </div>
      </div>
      <div className="nlp-train__main">
        {selectedNlpTrainComponent?.component}
      </div>
    </div>
  );
};

export default NlpTrain;
