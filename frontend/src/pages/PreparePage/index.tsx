import React, { FC, useState } from 'react';
import Layout from 'pages/_layouts/Layout';
import Button from 'components/common/Button';
import Texts from './components/Texts';
import NlpTextForm from './components/NlpTextForm';
import Labels from './components/Labels';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import './styles.scss';

const nlpTexts: NlpTextProps[] = [
  {
    id: 1,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vestibulum in orci ac aliquam. Nullam gravida mauris dictum, vulputate turpis eu, sodales neque. Quisque ut lobortis sapien. Donec id arcu venenatis, semper libero ultricies, blandit mauris. Donec malesuada neque velit, vel laoreet est eleifend eget. Pellentesque nec quam neque. Mauris sed egestas augue.',
    title: 'Title 1',
    labels: [],
  },
  {
    id: 2,
    text: 'Lorem ipsum dolor',
    title: 'Title 2',
    labels: [],
  },
];

const PreparePage: FC = () => {
  const [selectedNlpText, setSelectedNlpText] = useState<NlpTextProps>(
    nlpTexts[0]
  );

  const handleLoadDataset = () => {};

  const handleSaveDataset = () => {};

  const handleConvertNerLabelOrSummarizationToText = () => {};

  return (
    <Layout>
      <div className="prepare-page">
        <div className="prepare-page__main">
          <div className="prepare-page__buttons">
            <Button
              className="prepare-page__button"
              onClick={handleLoadDataset}
            >
              Load dataset
            </Button>
            <Button
              className="prepare-page__button"
              onClick={handleSaveDataset}
            >
              Save dataset
            </Button>
            <Button
              className="prepare-page__button"
              onClick={handleConvertNerLabelOrSummarizationToText}
            >
              Convert NER Label or Summarization to text
            </Button>
          </div>
          <div className="prepare-page__body">
            <Texts
              className="prepare-page__sidebar-left"
              nlpTexts={nlpTexts}
              selectedNlpText={selectedNlpText}
              setSelectedNlpText={setSelectedNlpText}
            />
            <NlpTextForm
              className="prepare-page__text-nlp-form"
              nlpText={selectedNlpText}
              setNlpText={setSelectedNlpText}
            />
            <Labels className="prepare-page__sidebar-right" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreparePage;
