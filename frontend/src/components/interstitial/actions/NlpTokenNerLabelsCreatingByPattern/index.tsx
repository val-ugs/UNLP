import React, { FC, useEffect, useState, MouseEvent, FormEvent } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useAppDispatch } from 'hooks/redux';
import Select, { SelectProps } from 'components/common/Select';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import LabeledElement from 'components/interstitial/LabeledElement';
import InputButton from 'components/common/Inputs/InputButton';
import { actionApi } from 'services/actionService';
import { actionModalSlice } from 'store/reducers/actionModalSlice';
import {
  CreateNlpTokenNerLabelsByPatternDtoProps,
  nerLabelPattern,
} from 'interfaces/dtos/createNlpTokenNerLabelsByPatternDto';
import AddNerLabelPattern from './addNerLabelPattern';
import UnorderedList from 'components/common/UnorderedList';
import Button from 'components/common/Button';
import { nerLabelApi } from 'services/nerLabelService';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import './styles.scss';

const emptyCreateNlpTokenNerLabelsByPatternDto: CreateNlpTokenNerLabelsByPatternDtoProps =
  {
    nlpDatasetId: undefined,
    nerLabelPatterns: [],
  };

const NlpTokenNerLabelsCreatingByPattern: FC = () => {
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>([]);
  const [nerLabels, setNerLabels] = useState<NerLabelProps[]>([]);
  const [error, setError] = useState<string>();
  const [
    createNlpTokenNerLabelsByPatternDto,
    setCreateNlpTokenNerLabelsByPatternDto,
  ] = useState<CreateNlpTokenNerLabelsByPatternDtoProps>(
    emptyCreateNlpTokenNerLabelsByPatternDto
  );
  const { deactivate } = actionModalSlice.actions;
  const dispatch = useAppDispatch();
  const [createNlpTokenNerLabelsByPattern, {}] =
    actionApi.useCreateNlpTokenNerLabelsByPatternMutation();
  const {
    data: nlpDatasetsData,
    error: nlpDatasetsError,
    isLoading: nlpDatasetsLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();
  const {
    data: nerLabelsData,
    isLoading: nerLabelsLoading,
    isError,
  } = nerLabelApi.useGetNerLabelsByNlpDatasetIdQuery(
    createNlpTokenNerLabelsByPatternDto.nlpDatasetId
      ? Number(createNlpTokenNerLabelsByPatternDto.nlpDatasetId)
      : skipToken
  );

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  useEffect(() => {
    if (nerLabelsData && !isError) setNerLabels(nerLabelsData);
    else setNerLabels([]);
  }, [nerLabelsData, createNlpTokenNerLabelsByPatternDto.nlpDatasetId]);

  const setNlpDatasetIdValue = (value: number) => {
    setCreateNlpTokenNerLabelsByPatternDto({
      ...createNlpTokenNerLabelsByPatternDto,
      nlpDatasetId: value,
    });
  };
  const nlpDatasetSelect: SelectProps<number> = {
    className: 'nlp-token-ner-label-creating-by-pattern__select',
    selectedValue: createNlpTokenNerLabelsByPatternDto.nlpDatasetId ?? 0,
    setSelectedValue: setNlpDatasetIdValue,
    children: nlpDatasets?.map((nlpDataset: NlpDatasetProps) => {
      return (
        <Select.Item key={nlpDataset.id} value={nlpDataset.id}>
          {`Dataset ${nlpDataset.id}`}
        </Select.Item>
      );
    }),
  };

  const handleAddNerLabelPattern = ({ nerLabel, pattern }: nerLabelPattern) => {
    setCreateNlpTokenNerLabelsByPatternDto({
      ...createNlpTokenNerLabelsByPatternDto,
      nerLabelPatterns: [
        ...createNlpTokenNerLabelsByPatternDto.nerLabelPatterns,
        { nerLabel: nerLabel, pattern: pattern },
      ],
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);

    await createNlpTokenNerLabelsByPattern(createNlpTokenNerLabelsByPatternDto)
      .unwrap()
      .then(() => dispatch(deactivate()))
      .catch((e) => {
        console.log(e);
        setError(e.data.message);
      });
  };

  return (
    <div className="nlp-token-ner-label-creating-by-pattern">
      <form onSubmit={handleSubmit}>
        <div className="nlp-token-ner-label-creating-by-pattern__item">
          <LabeledElement
            className="nlp-token-ner-label-creating-by-pattern__labeled-element"
            labelElement={{ value: 'Select nlp dataset' }}
          >
            <Select
              className={nlpDatasetSelect.className}
              selectedValue={nlpDatasetSelect.selectedValue}
              setSelectedValue={nlpDatasetSelect.setSelectedValue}
              disabled={nlpDatasetSelect.disabled}
            >
              {nlpDatasetSelect.children}
            </Select>
          </LabeledElement>
        </div>
        {nerLabels && nerLabels.length > 0 ? (
          <>
            <AddNerLabelPattern
              className="nlp-token-ner-label-creating-by-pattern__item"
              nerLabels={nerLabels}
              handleAddNerLabelPattern={handleAddNerLabelPattern}
            />
            {createNlpTokenNerLabelsByPatternDto.nerLabelPatterns &&
              createNlpTokenNerLabelsByPatternDto.nerLabelPatterns.length >
                0 && (
                <div className="nlp-token-ner-label-creating-by-pattern__item">
                  <div className="nlp-token-ner-label-creating-by-pattern__item-title">
                    &quot;Ner label&quot; - &quot;pattern:&quot;
                  </div>
                  <UnorderedList className="nlp-token-ner-label-creating-by-pattern__ner-label-patterns">
                    {createNlpTokenNerLabelsByPatternDto.nerLabelPatterns.map(
                      (nerLabelPattern, index) => {
                        return (
                          <UnorderedList.Item
                            className="nlp-token-ner-label-creating-by-pattern__ner-label-pattern"
                            key={index}
                          >
                            <div className="nlp-token-ner-label-creating-by-pattern__ner-label-pattern-content">
                              <div className="nlp-token-ner-label-creating-by-pattern__ner-label-pattern-text">
                                &quot;{nerLabelPattern.nerLabel?.name}&quot; -
                                &quot;{nerLabelPattern.pattern}&quot;
                              </div>
                              <Button
                                className="nlp-token-ner-label-creating-by-pattern__ner-label-pattern-button"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  setCreateNlpTokenNerLabelsByPatternDto({
                                    ...createNlpTokenNerLabelsByPatternDto,
                                    nerLabelPatterns:
                                      createNlpTokenNerLabelsByPatternDto.nerLabelPatterns.filter(
                                        (_, i) => i != index
                                      ),
                                  });
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </UnorderedList.Item>
                        );
                      }
                    )}
                  </UnorderedList>
                </div>
              )}
            <div className="nlp-token-ner-label-creating-by-pattern__item nlp-token-ner-label-creating-by-pattern__item-button">
              <InputButton className="nlp-token-ner-label-creating-by-pattern__button">
                Submit
              </InputButton>
            </div>
          </>
        ) : (
          createNlpTokenNerLabelsByPatternDto.nlpDatasetId && (
            <div className="nlp-token-ner-label-creating-by-pattern__item nlp-token-ner-label-creating-by-pattern__item-error">
              Error: Ner labels not found
            </div>
          )
        )}
      </form>
      {error && (
        <div className="nlp-token-ner-label-creating-by-pattern__item nlp-token-ner-label-creating-by-pattern__item-error">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default NlpTokenNerLabelsCreatingByPattern;
