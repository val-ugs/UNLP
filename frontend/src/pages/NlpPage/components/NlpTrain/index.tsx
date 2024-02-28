import React, { FC, useState } from 'react';
import Button from 'components/common/Button';
import HuggingFaceModelTrain from './components/HuggingFaceModelTrain';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import './styles.scss';

const NlpTrain: FC = () => {
  const [huggingFaceModel, setHuggingFaceModel] = useState<
    HuggingFaceModelProps | undefined
  >(undefined);
  const [trainHuggingFaceModel, {}] =
    huggingFaceModelApi.useTrainHuggingFaceModelMutation();

  const handleTrain = () => {
    if (huggingFaceModel) trainHuggingFaceModel(huggingFaceModel);
  };

  return (
    <div className="nlp-train">
      <div className="nlp-train__title">Prepare model to train:</div>
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
            Train
          </Button>
        </div>
      </div>
      <div className="nlp-train__title">Results:</div>
      <div className="nlp-train__item nlp-train__results"></div>
    </div>
  );
};

export default NlpTrain;
