import { NerLabelProps } from 'interfaces/nerLabel.interface';

export interface nerLabelPattern {
  nerLabel: NerLabelProps;
  pattern: string;
}

export interface CreateNlpTokenNerLabelsByPatternDtoProps {
  nlpDatasetId: number | undefined;
  nerLabelPatterns: nerLabelPattern[];
}
