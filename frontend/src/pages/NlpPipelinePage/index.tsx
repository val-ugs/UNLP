import React, { FC, useState } from 'react';
import Layout from 'pages/_layouts/Layout';
import Button from 'components/common/Button';
import { ActionProps } from 'interfaces/action.interface';
import AddAction from './components/AddAction';
import './styles.scss';

const NlpPipelinePage: FC = () => {
  const [actions, setActions] = useState<ActionProps[]>([]);
  const [selectedAction, setSelectedAction] = useState<ActionProps | undefined>(
    undefined
  );

  return (
    <Layout>
      <div className="nlp-pipeline-page">
        <div className="nlp-pipeline-page__sidebar">
          <div className="nlp-pipeline-page__title">Pipeline:</div>
          <div className="nlp-pipeline-page__list">
            {actions?.map((action: ActionProps, index: number) => (
              <Button
                className="nlp-pipeline-page__item"
                onClick={() => {
                  setSelectedAction(action);
                }}
                key={action.name}
              >
                {index + 1}. {action.name}
              </Button>
            ))}
            <AddAction
              className="nlp-pipeline-page__item"
              actions={actions}
              setActions={setActions}
            />
          </div>
        </div>
        <div className="nlp-pipeline-page__main">
          {selectedAction?.component}
        </div>
      </div>
    </Layout>
  );
};

export default NlpPipelinePage;
