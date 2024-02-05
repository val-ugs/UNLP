import { Sort } from 'data/enums/sort';
import { NlpTextProps } from 'interfaces/nlpText.interface';

export interface GetNlpTextPageRequestProps {
  nlpDatasetId?: number;
  search?: string;
  sort: Sort;
  pageSize?: number;
  page?: number;
}

export interface GetNlpTextPageResponseProps {
  nlpTextsCount: number;
  nlpTexts: NlpTextProps[];
}
