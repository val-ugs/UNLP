import React, { FC, useState } from 'react';
import Layout from 'pages/_layouts/Layout';
import Button from 'components/common/Button';
import NlpTexts from './components/NlpTexts';
import NlpTextForm from './components/NlpTextForm';
import NerLabels from './components/NerLabels';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import { useAppDispatch } from 'hooks/redux';
import { loadDataModalSlice } from 'store/reducers/loadDataModalSlice';
import './styles.scss';

const nlpTexts: NlpTextProps[] = [
  {
    id: 1,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vestibulum in orci ac aliquam. Nullam gravida mauris dictum, vulputate turpis eu, sodales neque. Quisque ut lobortis sapien. Donec id arcu venenatis, semper libero ultricies, blandit mauris. Donec malesuada neque velit, vel laoreet est eleifend eget. Pellentesque nec quam neque. Mauris sed egestas augue.',
    classification_label: 'Label 1',
    nlp_tokens: [],
  },
  {
    id: 2,
    text: 'Lorem ipsum dolor',
    classification_label: 'Label 2',
    nlp_tokens: [],
  },
];

const PreparePage: FC = () => {
  const [selectedNlpText, setSelectedNlpText] = useState<NlpTextProps>(
    nlpTexts[0]
  );
  const dispatch = useAppDispatch();
  const { activate } = loadDataModalSlice.actions;

  const handleLoadData = () => dispatch(activate());

  const handleSaveData = () => {};

  const handleConvertNerLabelOrSummarizationToText = () => {};

  return (
    <Layout>
      <div className="prepare-page">
        <div className="prepare-page__main">
          <div className="prepare-page__buttons">
            <Button className="prepare-page__button" onClick={handleLoadData}>
              Load data
            </Button>
            <Button className="prepare-page__button" onClick={handleSaveData}>
              Save data
            </Button>
            <Button
              className="prepare-page__button"
              onClick={handleConvertNerLabelOrSummarizationToText}
            >
              Convert NER Label or Summarization to text
            </Button>
          </div>
          <div className="prepare-page__body">
            <NlpTexts
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
            <NerLabels className="prepare-page__sidebar-right" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PreparePage;
