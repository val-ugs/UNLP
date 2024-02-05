import { Sort } from 'interfaces/enums/sort.interface';
import { NlpTextProps } from 'interfaces/nlpText.interface';

export interface GetNlpTextPageRequestProps {
  nlpDatasetId?: number;
  search?: string;
  sort?: Sort;
  pageSize?: number;
  page?: number;
}

export interface GetNlpTextPageResponseProps {
  nlpTextsCount: number;
  nlpTexts: NlpTextProps[];
}
