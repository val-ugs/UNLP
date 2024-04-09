import { fieldType } from 'data/enums/fieldType';

export interface createNlpDatasetByFieldDtoProps {
  nlpDatasetId?: number;
  field: fieldType;
  nerLabelId?: number;
  isClassificationLabelSaved: boolean;
  isSummarizationSaved: boolean;
}
