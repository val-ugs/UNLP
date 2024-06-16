import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from 'components/common/Button';
import HuggingFaceModelTrain from './components/HuggingFaceModelTrain';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import { TrainResultsDto } from 'interfaces/dtos/trainResultsDto.interface';
import './styles.scss';

const NlpTrain: FC = () => {
  const { t } = useTranslation();
  const [huggingFaceModel, setHuggingFaceModel] = useState<
    HuggingFaceModelProps | undefined
  >(undefined);
  const [trainResults, setTrainResults] = useState<TrainResultsDto[]>([]);
  const [trainHuggingFaceModel, {}] =
    huggingFaceModelApi.useTrainHuggingFaceModelMutation();

  const handleTrain = async () => {
    if (huggingFaceModel) {
      try {
        const results = await trainHuggingFaceModel(huggingFaceModel).unwrap();
        setTrainResults(results);
      } catch (error) {
        console.log(error);
        setTrainResults([]);
      }
    }
  };

  return (
    <div className="nlp-train">
      <div className="nlp-train__title">
        {t('nlpTrain.prepareModelToTrain', 'Prepare model to train:')}
      </div>
      <div className="nlp-train__item nlp-train__train">
        <div className="nlp-train__train-item">
          <HuggingFaceModelTrain
            className="nlp-train__hugging-face-modal-train"
            huggingFaceModel={huggingFaceModel}
            setHuggingFaceModel={setHuggingFaceModel}
          ></HuggingFaceModelTrain>
        </div>
        <div className="nlp-train__train-item">
          <Button className="nlp-train__train-button" onClick={handleTrain}>
            {t('nlpTrain.train', 'Train')}
          </Button>
        </div>
      </div>
      <div className="nlp-train__title">
        {t('nlpTrain.results', 'Results:')}
      </div>
      <div className="nlp-train__item nlp-train__results">
        {trainResults &&
          trainResults.map((result: TrainResultsDto) => (
            <div className="nlp-train__result" key={result.epoch}>
              <div className="nlp-train__result-item">{`Epoch: ${result.epoch}`}</div>
              <div className="nlp-train__result-item">{`Step: ${result.step}`}</div>
              {result.loss && (
                <div className="nlp-train__result-item">{`Loss: ${result.loss}`}</div>
              )}
              {result.gradNorm && (
                <div className="nlp-train__result-item">{`Grad norm: ${result.gradNorm}`}</div>
              )}
              {result.learningRate && (
                <div className="nlp-train__result-item">{`Learning rate: ${result.learningRate}`}</div>
              )}
              {result.trainRuntime && (
                <div className="nlp-train__result-item">{`Train runtime: ${result.trainRuntime}`}</div>
              )}
              {result.trainSamplesPerSecond && (
                <div className="nlp-train__result-item">{`Train samples per second: ${result.trainSamplesPerSecond}`}</div>
              )}
              {result.trainStepsPerSecond && (
                <div className="nlp-train__result-item">{`Train steps per seconds: ${result.trainStepsPerSecond}`}</div>
              )}
              {result.totalFlos && (
                <div className="nlp-train__result-item">{`Total flos: ${result.totalFlos}`}</div>
              )}
              {result.trainLoss && (
                <div className="nlp-train__result-item">{`Train loss: ${result.trainLoss}`}</div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default NlpTrain;
