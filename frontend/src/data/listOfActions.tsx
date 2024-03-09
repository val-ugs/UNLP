import { ActionProps } from 'interfaces/action.interface';
import NlpDatasetCleaning from 'components/interstitial/actions/NlpDatasetCleaning';
import NlpDatasetCopying from 'components/interstitial/actions/NlpDatasetCopying';

export const listOfActions: ActionProps[] = [
  {
    name: 'Clear dataset',
    component: <NlpDatasetCleaning />,
  },
  {
    name: 'Copy dataset',
    component: <NlpDatasetCopying />,
  },
];
