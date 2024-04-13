import { ActionProps } from 'interfaces/action.interface';
import NlpDatasetClearing from 'components/interstitial/actions/NlpDatasetClearing';
import NlpDatasetCopying from 'components/interstitial/actions/NlpDatasetCopying';
import NlpDatasetCreatingByField from 'components/interstitial/actions/NlpDatasetCreatingByField';

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
];
