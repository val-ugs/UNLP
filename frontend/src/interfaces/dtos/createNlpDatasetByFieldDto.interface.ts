import { fieldType } from 'data/enums/fieldType';

export interface createNlpDatasetByFieldDtoProps {
  field: fieldType;
  nerLabelId?: number;
  isClassificationLabelSaved: boolean;
  isSummarizationSaved: boolean;
}
