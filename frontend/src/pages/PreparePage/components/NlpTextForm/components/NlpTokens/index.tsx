import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NlpTokenProps } from 'interfaces/nlpToken.interface';
import { NerLabelProps } from 'interfaces/nerLabel.interface';
import Accordion from 'components/common/Accordion';
import NlpTokenItem from './components/NlpTokenItem';
import { nlpTokenApi } from 'services/nlpTokenService';
import './styles.scss';

export interface NlpTokensItemProps {
  className: string;
  nlpTextId: number;
  nerLabels: NerLabelProps[];
}

const NlpTokens: FC<NlpTokensItemProps> = ({
  className,
  nlpTextId,
  nerLabels,
}) => {
  const { t } = useTranslation();
  const [nlpTokens, setNlpTokens] = useState<NlpTokenProps[]>([]);
  const {
    data: nlpTokensData,
    isLoading,
    isError,
  } = nlpTokenApi.useGetNlpTokenByNlpTextIdQuery(Number(nlpTextId));

  useEffect(() => {
    if (nlpTokensData && !isError) setNlpTokens(nlpTokensData);
    else setNlpTokens([]);
  }, [nlpTokensData, nlpTextId]);

  return (
    <div className={`nlp-tokens ${className}`}>
      <Accordion
        className="nlp-tokens__accordion nlp-text-form__accordion"
        header={`${t('nlpTokens.tokens', 'Tokens')}:`}
      >
        <div className="nlp-tokens__area">
          {nlpTokens && nlpTokens.length > 0 ? (
            nlpTokens.map((nlpToken) => (
              <NlpTokenItem
                className="nlp-tokens__item"
                nlpToken={nlpToken}
                nerLabels={nerLabels}
                key={nlpToken.id}
              />
            ))
          ) : (
            <div className="nlp-tokens__item">
              {t(
                'nlpTokens.npTokensFound',
                'No tokens found. Check token settings.'
              )}
            </div>
          )}
        </div>
      </Accordion>
    </div>
  );
};

export default NlpTokens;
