import { NerLabelProps } from './nerLabel.interface';

export interface NlpTokenNerLabelProps {
  nlpTokenId: number;
  nerLabel: NerLabelProps | undefined;
  initial: boolean;
}
