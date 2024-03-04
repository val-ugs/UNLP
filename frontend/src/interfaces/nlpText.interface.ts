import { NlpTokenProps } from './nlpToken.interface';

export interface NlpTextProps {
  id: number;
  text: string;
  classificationLabel: string;
  summarization: string;
  nlpTokens?: NlpTokenProps[];
}
