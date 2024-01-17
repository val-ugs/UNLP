import { NerLabelProps } from './nerLabel.interface';

export interface NlpTokenProps {
  id: number;
  token: string;
  pos: number;
  ner_label: NerLabelProps;
}
