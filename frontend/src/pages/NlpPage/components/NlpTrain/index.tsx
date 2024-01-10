import React, { FC } from 'react';
import Button from 'components/common/Button';
import './styles.scss';

interface NlpTrainActionProps {
  name: string;
  action: () => void;
}

const nlpActions: NlpTrainActionProps[] = [
  {
    name: 'Load data',
    action: () => {},
  },
  {
    name: 'Select NLP algorithm',
    action: () => {},
  },
  {
    name: 'Nlp algorithm results 1',
    action: () => {},
  },
];

const NlpTrain: FC = () => {
  return (
    <div className="nlp-train">
      <div className="nlp-train__sidebar">
        <div className="nlp-train__title">Train:</div>
        <div className="nlp-train__list">
          {nlpActions?.map((nlpAction: NlpTrainActionProps, index: number) => (
            <Button
              className="nlp-train__item"
              onClick={nlpAction.action}
              key={index}
            >
              {nlpAction.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="nlp-train__main">Algorithm</div>
    </div>
  );
};

export default NlpTrain;
