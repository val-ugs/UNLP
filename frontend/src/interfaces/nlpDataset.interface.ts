import { NlpTextProps } from 'interfaces/nlpText.interface';
import { NerLabelProps } from './nerLabel.interface';

export interface NlpDatasetProps {
  id: number;
  tokenPatternToRemove: string;
  tokenPatternToSplit: string;
  nlpTexts: NlpTextProps[];
  nerLabels: NerLabelProps[];
}
