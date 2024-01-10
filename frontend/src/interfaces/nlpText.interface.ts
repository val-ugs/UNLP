import { LabelProps } from './label.interface';

export interface NlpTextProps {
  id: number;
  text: string;
  title: string;
  labels: LabelProps[];
}
