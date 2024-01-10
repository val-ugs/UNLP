import React, { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from 'pages/_layouts/Layout';
import NlpTrain from './components/NlpTrain';
import NlpPredict from './components/NlpPredict';
import OrderedList from 'components/common/OrderedList';
import NavLinkButton, {
  NavLinkButtonProps,
} from 'components/common/NavLinkButton';
import './styles.scss';

const nlpMethodNavLinkButtons: NavLinkButtonProps[] = [
  {
    to: './train',
    children: 'Train',
  },
  {
    to: './predict',
    children: 'Predict',
  },
];

const NlpPage: FC = () => {
  return (
    <Layout>
      <div className="nlp-page">
        <OrderedList type={'none'} className="nlp-page__methods">
          {nlpMethodNavLinkButtons?.map(
            (item: NavLinkButtonProps, index: number) => (
              <OrderedList.Item className="nlp-page__method" key={index}>
                <NavLinkButton to={item.to}>{item.children}</NavLinkButton>
              </OrderedList.Item>
            )
          )}
        </OrderedList>
        <div className="nlp-page__main">
          <Routes>
            <Route path="train" element={<NlpTrain />} />
            <Route path="predict" element={<NlpPredict />} />
            <Route path="*" element={<Navigate to="train" replace={true} />} />
          </Routes>
        </div>
      </div>
    </Layout>
  );
};

export default NlpPage;
