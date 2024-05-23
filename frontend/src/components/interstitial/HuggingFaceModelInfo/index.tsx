import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LabeledElement from 'components/interstitial/LabeledElement';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';
import Accordion from 'components/common/Accordion';
import './styles.scss';

interface HuggingFaceModelInfoProps {
  huggingFaceModel: HuggingFaceModelProps | undefined;
}

const HuggingFaceModelInfo: FC<HuggingFaceModelInfoProps> = ({
  huggingFaceModel,
}) => {
  const { t } = useTranslation();
  const [nlpDatasets, setNlpDatasets] = useState<NlpDatasetProps[]>();
  const {
    data: nlpDatasetsData,
    error,
    isLoading,
  } = nlpDatasetApi.useGetNlpDatasetsQuery();

  useEffect(() => {
    if (nlpDatasetsData) setNlpDatasets(nlpDatasetsData);
  }, [nlpDatasetsData]);

  const getNlpDatasetById = (id: number) =>
    nlpDatasets?.find((nlpDataset) => nlpDataset.id == id);

  return (
    <>
      {huggingFaceModel && (
        <Accordion
          className="hugging-face-model-info"
          isOpenOnStart={false}
          header={`${huggingFaceModel.name} Info`}
        >
          <div className="hugging-face-model-info__info">
            <div className="hugging-face-model-info__training-args-name">
              {t('huggingFaceModelInfo.parameters', 'Parameters')}:
            </div>
            <LabeledElement
              className="hugging-face-model-info__labeled-element"
              labelElement={{
                value: t(
                  'huggingFaceModelInfo.modelNameOrPath',
                  'Model name or path'
                ),
              }}
            >
              {huggingFaceModel.modelNameOrPath}
            </LabeledElement>
            <LabeledElement
              className="hugging-face-model-info__labeled-element"
              labelElement={{
                value: t(
                  'huggingFaceModelInfo.trainNlpDataset',
                  'Train dataset'
                ),
              }}
            >
              {getNlpDatasetById(huggingFaceModel.trainNlpDataset)?.id}
            </LabeledElement>
            <LabeledElement
              className="hugging-face-model-info__labeled-element"
              labelElement={{
                value: t(
                  'huggingFaceModelInfo.validNlpDataset',
                  'Valid dataset'
                ),
              }}
            >
              {getNlpDatasetById(huggingFaceModel.validNlpDataset)?.id}
            </LabeledElement>
            <LabeledElement
              className="hugging-face-model-info__labeled-element"
              labelElement={{
                value: t(
                  'huggingFaceModelInfo.evaluateMetricName',
                  'Evaluate metric name'
                ),
              }}
            >
              {huggingFaceModel.evaluateMetricName}
            </LabeledElement>
            {huggingFaceModel.trainingArgs ? (
              <div className="hugging-face-model-info__training-args">
                <div className="hugging-face-model-info__training-args-name">
                  {t('huggingFaceModelInfo.trainingArgs', 'Training args:')}
                </div>
                <LabeledElement
                  className="hugging-face-model-info__labeled-element"
                  labelElement={{
                    value: t(
                      'huggingFaceModelInfo.learningRate',
                      'Learning rate'
                    ),
                  }}
                >
                  {huggingFaceModel.trainingArgs.learningRate}
                </LabeledElement>
                <LabeledElement
                  className="hugging-face-model-info__labeled-element"
                  labelElement={{
                    value: t(
                      'huggingFaceModelInfo.perDeviceTrainBatchSize',
                      'Per device train batch size'
                    ),
                  }}
                >
                  {huggingFaceModel.trainingArgs.perDeviceTrainBatchSize}
                </LabeledElement>
                <LabeledElement
                  className="hugging-face-model-info__labeled-element"
                  labelElement={{
                    value: t(
                      'huggingFaceModelInfo.perDeviceEvalBatchSize',
                      'Per device eval batch size'
                    ),
                  }}
                >
                  {huggingFaceModel.trainingArgs.perDeviceEvalBatchSize}
                </LabeledElement>
                <LabeledElement
                  className="hugging-face-model-info__labeled-element"
                  labelElement={{
                    value: t(
                      'huggingFaceModelInfo.numTrainEpochs',
                      'Num train epochs'
                    ),
                  }}
                >
                  {huggingFaceModel.trainingArgs.numTrainEpochs}
                </LabeledElement>
                <LabeledElement
                  className="hugging-face-model-info__labeled-element"
                  labelElement={{
                    value: t(
                      'huggingFaceModelInfo.weightDecay',
                      'Weight decay'
                    ),
                  }}
                >
                  {huggingFaceModel.trainingArgs.weightDecay}
                </LabeledElement>
                <LabeledElement
                  className="hugging-face-model-info__labeled-element"
                  labelElement={{
                    value: t(
                      'huggingFaceModelInfo.evaluationStrategy',
                      'Evaluation strategy'
                    ),
                  }}
                >
                  {huggingFaceModel.trainingArgs.evaluationStrategy}
                </LabeledElement>
                <LabeledElement
                  className="hugging-face-model-info__labeled-element"
                  labelElement={{
                    value: t(
                      'huggingFaceModelInfo.saveStrategy',
                      'Save strategy'
                    ),
                  }}
                >
                  {huggingFaceModel.trainingArgs.saveStrategy}
                </LabeledElement>
                <LabeledElement
                  className="hugging-face-model-info__labeled-element"
                  labelElement={{
                    value: t(
                      'huggingFaceModelInfo.loadBestModelAtEnd',
                      'Load best model at end'
                    ),
                  }}
                >
                  {huggingFaceModel.trainingArgs.loadBestModelAtEnd.toString()}
                </LabeledElement>
              </div>
            ) : (
              <>
                {t(
                  'huggingFaceModelInfo.trainingArgsNotFound',
                  'Training args not found'
                )}
              </>
            )}
          </div>
        </Accordion>
      )}
    </>
  );
};

export default HuggingFaceModelInfo;
