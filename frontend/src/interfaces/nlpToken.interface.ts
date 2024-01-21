import { NlpTokenNerLabelProps } from './nlpTokenNerLabel.interface';

export interface NlpTokenProps {
  id: number;
  token: string;
  pos: number;
  nlpTokenNerLabel?: NlpTokenNerLabelProps;
}
