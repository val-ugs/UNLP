import { ActionProps } from 'interfaces/action.interface';
import NlpDatasetClearing from 'components/interstitial/actions/NlpDatasetClearing';
import NlpDatasetCopying from 'components/interstitial/actions/NlpDatasetCopying';
import NlpDatasetCreatingByField from 'components/interstitial/actions/NlpDatasetCreatingByField';
import NlpDatasetDeletingTextsWithoutFields from 'components/interstitial/actions/NlpDatasetDeletingTextsWithoutFields';
import NlpTokenNerLabelsCreatingByPattern from 'components/interstitial/actions/NlpTokenNerLabelsCreatingByPattern';
import NlpDatasetCreatingByTemplate from 'components/interstitial/actions/NlpDatasetCreatingByTemplate';

export const listOfActions: ActionProps[] = [
  {
    name: 'Clear dataset',
    component: <NlpDatasetClearing />,
  },
  {
    name: 'Copy dataset',
    component: <NlpDatasetCopying />,
  },
  {
    name: 'Create dataset by field',
    component: <NlpDatasetCreatingByField />,
  },
  {
    name: 'Delete texts without fields',
    component: <NlpDatasetDeletingTextsWithoutFields />,
  },
  {
    name: 'Create nlp token ner labels by pattern',
    component: <NlpTokenNerLabelsCreatingByPattern />,
  },
  {
    name: 'Create nlp dataset by template',
    component: <NlpDatasetCreatingByTemplate />,
  },
];
