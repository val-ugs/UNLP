import React, { FC, ReactNode, useState } from 'react';
import Layout from 'pages/_layouts/Layout';
import Button from 'components/common/Button';
import AddNlpComponent from './components/AddNlpComponent';
import './styles.scss';

interface NlpComponentProps {
  id: number;
  name: string;
  component: ReactNode;
}

const NlpPipelinePage: FC = () => {
  const [nlpComponents, setNlpComponents] = useState<NlpComponentProps[]>([]);
  const [selectedNlpComponent, setSelectedNlpComponent] = useState<
    NlpComponentProps | undefined
  >(undefined);

  return (
    <Layout>
      <div className="nlp-pipeline-page">
        <div className="nlp-pipeline-page__sidebar">
          <div className="nlp-pipeline-page__title">Pipeline:</div>
          <div className="nlp-pipeline-page__list">
            {nlpComponents?.map(
              (nlpComponent: NlpComponentProps, index: number) => (
                <Button
                  className="nlp-pipeline-page__item"
                  onClick={() => {
                    setSelectedNlpComponent(nlpComponent);
                  }}
                  key={nlpComponent.id}
                >
                  {index + 1}. {nlpComponent.name}
                </Button>
              )
            )}
            <AddNlpComponent
              className="nlp-pipeline-page__item"
              nlpComponents={nlpComponents}
              setNlpComponents={setNlpComponents}
            />
          </div>
        </div>
        <div className="nlp-pipeline-page__main">
          {selectedNlpComponent?.component}
        </div>
      </div>
    </Layout>
  );
};

export default NlpPipelinePage;
