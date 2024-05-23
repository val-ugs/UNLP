import React, { FC, useEffect, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { skipToken } from '@reduxjs/toolkit/query';
import { NodeProps } from 'reactflow';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import BaseNode from '../../_common/BaseNode';
import { InputHandlesItemProps } from '../../_common/InputHandles';
import { OutputHandlesItemProps } from '../../_common/OutputHandles';
import { nerLabelPattern } from 'interfaces/dtos/createNlpTokenNerLabelsByPatternDto';
import AddNerLabelPattern from 'components/interstitial/actions/NlpTokenNerLabelsCreatingByPattern/addNerLabelPattern';
import { nerLabelApi } from 'services/nerLabelService';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import UnorderedList from 'components/common/UnorderedList';
import Button from 'components/common/Button';
import { reactFlowSlice } from 'store/reducers/reactFlowSlice';
import { useAppDispatch } from 'hooks/redux';
import './styles.scss';

interface NlpTokenNerLabelsCreatingByPatternNodeProps {
  input: {
    nlpDataset: NlpDatasetProps;
    nerLabelPatterns: nerLabelPattern[];
  };
  output: {
    nlpDataset: NlpDatasetProps;
  };
  running: boolean;
}

const NlpTokenNerLabelsCreatingByPatternNode: FC<
  NodeProps<NlpTokenNerLabelsCreatingByPatternNodeProps>
> = (node) => {
  const { t } = useTranslation();
  const [nerLabels, setNerLabels] = useState<NerLabelProps[]>([]);
  const { editNode } = reactFlowSlice.actions;
  const dispatch = useAppDispatch();
  const {
    data: nerLabelsData,
    isLoading: nerLabelsLoading,
    isError,
  } = nerLabelApi.useGetNerLabelsByNlpDatasetIdQuery(
    node.data?.input?.nlpDataset?.id
      ? Number(node.data?.input?.nlpDataset?.id)
      : skipToken
  );

  useEffect(() => {
    if (nerLabelsData && !isError) setNerLabels(nerLabelsData);
    else setNerLabels([]);
  }, [nerLabelsData, node.data?.input?.nlpDataset?.id]);

  const inputHandles: InputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  const outputHandles: OutputHandlesItemProps[] = [
    {
      id: 'nlpDataset',
    },
  ];

  const handleAddNerLabelPattern = ({ nerLabel, pattern }: nerLabelPattern) => {
    dispatch(
      editNode({
        id: node.id,
        newData: {
          input: {
            ...node.data?.input,
            nerLabelPatterns: node.data?.input?.nerLabelPatterns
              ? [
                  ...node.data?.input?.nerLabelPatterns,
                  { nerLabel: nerLabel, pattern: pattern },
                ]
              : [{ nerLabel: nerLabel, pattern: pattern }],
          },
        },
      })
    );
  };

  return (
    <BaseNode
      className="nlp-token-ner-labels-creating-by-pattern-node"
      inputHandles={inputHandles}
      outputHandles={outputHandles}
      running={node.data?.running}
    >
      <div className="nlp-token-ner-labels-creating-by-pattern-node__main">
        <div className="nlp-token-ner-labels-creating-by-pattern-node__main-title">
          {t(
            'nlpTokenNerLabelsCreatingByPatternNode.createNlpTokenNerLabelsByPattern',
            'Create token ner labels by pattern'
          )}
        </div>
        {nerLabels && nerLabels.length > 0 ? (
          <>
            <AddNerLabelPattern
              className="nlp-token-ner-labels-creating-by-pattern-node__item"
              nerLabels={nerLabels}
              handleAddNerLabelPattern={handleAddNerLabelPattern}
            />
            {node.data?.input?.nerLabelPatterns &&
              node.data?.input?.nerLabelPatterns?.length > 0 && (
                <div className="nlp-token-ner-labels-creating-by-pattern-node__item">
                  <div className="nlp-token-ner-labels-creating-by-pattern-node__item-title">
                    &quot;
                    {t(
                      'nlpTokenNerLabelsCreatingByPatternNode.nerLabel',
                      'NER label'
                    )}
                    &quot; - &quot;
                    {t(
                      'nlpTokenNerLabelsCreatingByPatternNode.pattern',
                      'pattern'
                    )}
                    :&quot;
                  </div>
                  <UnorderedList className="nlp-token-ner-labels-creating-by-pattern-node__ner-label-patterns">
                    {node.data?.input?.nerLabelPatterns?.map(
                      (nerLabelPattern, index) => {
                        return (
                          <UnorderedList.Item
                            className="nlp-token-ner-labels-creating-by-pattern-node__ner-label-pattern"
                            key={index}
                          >
                            <div className="nlp-token-ner-labels-creating-by-pattern-node__ner-label-pattern-content">
                              <div className="nlp-token-ner-labels-creating-by-pattern-node__ner-label-pattern-text">
                                &quot;{nerLabelPattern.nerLabel?.name}&quot; -
                                &quot;{nerLabelPattern.pattern}&quot;
                              </div>
                              <Button
                                className="nlp-token-ner-labels-creating-by-pattern-node__ner-label-pattern-button"
                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                  e.preventDefault();
                                  dispatch(
                                    editNode({
                                      id: node.id,
                                      newData: {
                                        input: {
                                          ...node.data?.input,
                                          nerLabelPatterns:
                                            node.data?.input?.nerLabelPatterns.filter(
                                              (_, i) => i != index
                                            ),
                                        },
                                      },
                                    })
                                  );
                                }}
                              >
                                {t(
                                  'nlpTokenNerLabelsCreatingByPatternNode.delete',
                                  'Delete'
                                )}
                              </Button>
                            </div>
                          </UnorderedList.Item>
                        );
                      }
                    )}
                  </UnorderedList>
                </div>
              )}
          </>
        ) : (
          <div className="nlp-token-ner-labels-creating-by-pattern-node__item nlp-token-ner-labels-creating-by-pattern-node__item-error">
            Warning: Ner labels not found. Try run program.
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default NlpTokenNerLabelsCreatingByPatternNode;
