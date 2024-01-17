import { NlpTokenProps } from './nlpToken.interface';

export interface NlpTextProps {
  id: number;
  text: string;
  classification_label: string;
  nlp_tokens: NlpTokenProps[];
}
