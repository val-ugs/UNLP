import { NlpTextProps } from 'interfaces/nlpText.interface';

export interface NlpDataset {
  id: string;
  token_pattern_to_remove: string;
  token_pattern_to_split: string;
  nlp_texts: NlpTextProps[];
}
