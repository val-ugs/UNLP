import React, { FC, useState, useEffect, useMemo } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import Button from 'components/common/Button';
import { NlpTextProps } from 'interfaces/nlpText.interface';
import { nlpTextApi } from 'services/nlpTextService';
import { GetNlpTextPageRequestProps } from 'interfaces/dtos/getNlpTextPage.interface';
import InputNumber, {
  InputNumberProps,
} from 'components/common/Inputs/InputNumber';
import InputButton from 'components/common/Inputs/InputButton';
import './styles.scss';

export interface NlpTextsProps {
  className: string;
  nlpDatasetId: number | undefined;
  selectedNlpTextId: number | undefined;
  setSelectedNlpTextId: (id: number) => void;
}

const pageSize = 15;

const NlpTexts: FC<NlpTextsProps> = ({
  className,
  nlpDatasetId,
  selectedNlpTextId,
  setSelectedNlpTextId,
}) => {
  const [getNlpTextRequest, setGetNlpTextRequest] =
    useState<GetNlpTextPageRequestProps>({
      nlpDatasetId: nlpDatasetId,
      search: undefined,
      sort: undefined,
      pageSize: pageSize,
      page: 1,
    });
  const [nlpTexts, setNlpTexts] = useState<NlpTextProps[]>([]);
  const [isOpenSetPage, setIsOpenSetPage] = useState<boolean>();
  const {
    data: getNlpTextsResponse,
    isLoading,
    isError,
  } = nlpTextApi.useGetNlpTextsQuery(getNlpTextRequest ?? skipToken);
  const [deleteNlpText, {}] = nlpTextApi.useDeleteNlpTextMutation();

  useEffect(() => {
    if (getNlpTextsResponse?.nlpTexts && !isError) {
      setNlpTexts(getNlpTextsResponse.nlpTexts);
      selectedNlpTextId
        ? setSelectedNlpTextId(selectedNlpTextId)
        : setSelectedNlpTextId(getNlpTextsResponse.nlpTexts[0].id);
    }
  }, [getNlpTextsResponse, nlpDatasetId]);

  const handleDelete = () => {
    if (selectedNlpTextId) deleteNlpText(selectedNlpTextId);

    if (nlpTexts && nlpTexts.length > 1) {
      const deletedNlpText = nlpTexts.find(
        (nlpText) => nlpText.id === selectedNlpTextId
      );
      if (deletedNlpText) {
        const deletedNlpTextIndex = nlpTexts.indexOf(deletedNlpText);
        setSelectedNlpTextId(
          nlpTexts[
            deletedNlpTextIndex > 0
              ? deletedNlpTextIndex - 1
              : deletedNlpTextIndex + 1
          ].id
        );
      }
    } else setNlpTexts([]);
  };

  const totalPages = useMemo(() => {
    if (getNlpTextsResponse)
      return Math.ceil(getNlpTextsResponse.nlpTextsCount / pageSize);
    return 0;
  }, [getNlpTextsResponse]);

  const handlePrevPage = () => {
    setGetNlpTextRequest((getNlpTextRequest) => {
      if (getNlpTextRequest.page && getNlpTextRequest.page - 1 > 0)
        return {
          ...getNlpTextRequest,
          page: getNlpTextRequest.page - 1,
        };
      else return getNlpTextRequest;
    });
  };

  const handleToggleSetPage = () => {
    setIsOpenSetPage(!isOpenSetPage);
  };

  const setPage = (value: number) => {
    if (value > 0 && value <= totalPages)
      setGetNlpTextRequest((getNlpTextRequest) => {
        return { ...getNlpTextRequest, page: value };
      });
  };
  const pageField: InputNumberProps = {
    className: 'nlp-texts__pagination-input',
    name: 'page',
    value: getNlpTextRequest.page ?? 1,
    setValue: setPage,
  };

  const handleNextPage = () => {
    setGetNlpTextRequest((getNlpTextRequest) => {
      if (getNlpTextRequest.page && getNlpTextRequest.page + 1 <= totalPages)
        return {
          ...getNlpTextRequest,
          page: getNlpTextRequest.page + 1,
        };
      else return getNlpTextRequest;
    });
  };

  return (
    <div className={`nlp-texts ${className}`}>
      <div className="nlp-texts__title">Texts:</div>
      <div className="nlp-texts__list">
        {nlpTexts?.map((nlpText: NlpTextProps) => (
          <Button
            className={`nlp-texts__item ${
              selectedNlpTextId == nlpText.id ? 'active' : ''
            }`}
            onClick={() => setSelectedNlpTextId(nlpText.id)}
            key={nlpText.id}
          >
            {nlpText.text}
          </Button>
        ))}
      </div>
      <div className="nlp-texts__pagination">
        <Button className="nlp-texts__pagination-prev" onClick={handlePrevPage}>
          Prev
        </Button>
        {getNlpTextsResponse?.nlpTextsCount && (
          <>
            {!isOpenSetPage ? (
              <Button
                className="nlp-texts__pagination-page"
                onClick={handleToggleSetPage}
              >{`${getNlpTextRequest.page}/${totalPages}`}</Button>
            ) : (
              <form
                className="nlp-texts__pagination-page"
                name={pageField.name}
                onSubmit={handleToggleSetPage}
              >
                <InputNumber
                  className={pageField.className}
                  name={pageField.name}
                  value={pageField.value}
                  setValue={pageField.setValue}
                  placeholder={pageField.placeholder}
                  disabled={pageField.disabled}
                />
                <div className="nlp-texts__pagination-submit">
                  <InputButton className="nlp-texts__pagination-submit-button">
                    Ok
                  </InputButton>
                </div>
              </form>
            )}
          </>
        )}
        <Button className="nlp-texts__pagination-next" onClick={handleNextPage}>
          Next
        </Button>
      </div>
      <div className="nlp-texts__bottom">
        <div className="nlp-texts__delete">
          <Button className="nlp-texts__delete-button" onClick={handleDelete}>
            Delete selected text
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NlpTexts;
