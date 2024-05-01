import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

export interface CreateNlpDatasetByTemplateDtoProps {
  nlpDatasets: NlpDatasetProps[];
  template: string;
  delimiter: string;
}
