import React, { FC, useState } from 'react';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import HuggingFaceModelPredict from './components/HuggingFaceModelPredict';
import Button from 'components/common/Button';
import { PredictResultsDto } from 'interfaces/dtos/predictResultsDto.interface';
import './styles.scss';

const NlpPredict: FC = () => {
  const [huggingFaceModel, setHuggingFaceModel] = useState<
    HuggingFaceModelProps | undefined
  >(undefined);
  const [testNlpDatasetId, setTestNlpDatasetId] = useState<number>(0);
  const [predictResults, setPredictResults] = useState<
    PredictResultsDto | undefined
  >(undefined);
  const [predictHuggingFaceModel, {}] =
    huggingFaceModelApi.usePredictHuggingFaceModelMutation();

  const handlePredict = async () => {
    if (huggingFaceModel) {
      try {
        const results = await predictHuggingFaceModel({
          huggingFaceModel,
          testNlpDatasetId,
        }).unwrap();
        setPredictResults(results);
      } catch (error) {
        console.log(error);
        setPredictResults(undefined);
      }
    }
  };

  return (
    <div className="nlp-predict">
      <div className="nlp-predict__title">Prepare model to predict:</div>
      <div className="nlp-predict__item nlp-predict__predict">
        <div className="nlp-predict__predict-item">
          <HuggingFaceModelPredict
            className="nlp-predict__hugging-face-modal-predict"
            huggingFaceModel={huggingFaceModel}
            setHuggingFaceModel={setHuggingFaceModel}
            testNlpDatasetId={testNlpDatasetId}
            setTestNlpDatasetId={setTestNlpDatasetId}
          ></HuggingFaceModelPredict>
        </div>
        <div className="nlp-predict__predict-item">
          <Button
            className="nlp-predict__predict-button"
            onClick={handlePredict}
          >
            Predict
          </Button>
        </div>
      </div>
      <div className="nlp-predict__title">Results:</div>
      <div className="nlp-predict__item nlp-predict__results">
        {predictResults && (
          <div className="nlp-predict__result">
            <div className="nlp-predict__result-item">{`Predict runtime: ${predictResults.predictRuntime}`}</div>
            <div className="nlp-predict__result-item">{`Predict samples per second: ${predictResults.predictSamplesPerSecond}`}</div>
            <div className="nlp-predict__result-item">{`Predict steps per second: ${predictResults.predictStepsPerSecond}`}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NlpPredict;
