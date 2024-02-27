import React, { FC, useState } from 'react';
import Button from 'components/common/Button';
import PrepareHuggingFaceModel from './components/PrepareHuggingFaceModel';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';
import './styles.scss';

const NlpTrain: FC = () => {
  const [huggingFaceModel, setHuggingFaceModel] = useState<
    HuggingFaceModelProps | undefined
  >(undefined);

  return (
    <div className="nlp-train">
      <div className="nlp-train__title">Prepare model:</div>
      <div className="nlp-train__item nlp-train__train">
        <div className="nlp-train__train-item">
          <PrepareHuggingFaceModel
            className="nlp-train__prepare-hugging-face-modal"
            huggingFaceModel={huggingFaceModel}
            setHuggingFaceModel={setHuggingFaceModel}
          ></PrepareHuggingFaceModel>
        </div>
        <div className="nlp-train__train-item">
          <Button className="nlp-train__train-button" onClick={() => {}}>
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
