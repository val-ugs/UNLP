import { ActionProps } from 'interfaces/action.interface';
import NlpDatasetCleaning from 'components/interstitial/actions/NlpDatasetCleaning';
import NlpDatasetCopying from 'components/interstitial/actions/NlpDatasetCopying';
import NlpDatasetCreatingByField from 'components/interstitial/actions/NlpDatasetCreatingByField';

export const listOfActions: ActionProps[] = [
  {
    name: 'Clear dataset',
    component: <NlpDatasetCleaning />,
  },
  {
    name: 'Copy dataset',
    component: <NlpDatasetCopying />,
  },
  {
    name: 'Create by field dataset',
    component: <NlpDatasetCreatingByField />,
  },
];
