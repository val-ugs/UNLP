import React, { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PreparePage from 'pages/PreparePage';
import NlpPage from 'pages/NlpPage';
import NlpConstructorPage from 'pages/NlpConstructorPage';
import './styles.scss';

const AppRouter: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/nlp/*" element={<NlpPage />} />
        <Route path="/nlp-constructor" element={<NlpConstructorPage />} />
        <Route path="/prepare" element={<PreparePage />} />
        <Route path="*" element={<Navigate to="/prepare" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
