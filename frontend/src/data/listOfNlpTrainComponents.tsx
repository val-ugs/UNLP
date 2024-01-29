import { NlpTrainComponentProps } from 'interfaces/nlpTrainComponent.interface';

export const listOfNlpTrainComponents: NlpTrainComponentProps[] = [
  {
    id: 1,
    name: 'Load data',
    component: <>Load data</>,
  },
  {
    id: 2,
    name: 'Prepare NLP algorithm',
    component: <>Prepare NLP algorithm</>,
  },
  {
    id: 3,
    name: 'Nlp algorithm results',
    component: <>Nlp algorithm results</>,
  },
];
