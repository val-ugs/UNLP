import PrepareNlpModel from 'components/interstitial/nlpTrainComponents/PrepareNlpModel';
import { NlpTrainComponentProps } from 'interfaces/nlpTrainComponent.interface';

export const listOfNlpTrainComponents: NlpTrainComponentProps[] = [
  {
    id: 1,
    name: 'Load data',
    component: <>Load data</>,
  },
  {
    id: 2,
    name: 'Prepare NLP model',
    component: <PrepareNlpModel />,
  },
  {
    id: 3,
    name: 'Nlp model results',
    component: <>Nlp algorithm results</>,
  },
];
