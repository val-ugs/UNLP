import { NerLabelProps } from './nerLabel.interface';

export interface NlpTokenProps {
  id: number;
  token: string;
  pos: number;
  nerLabel: NerLabelProps;
}
