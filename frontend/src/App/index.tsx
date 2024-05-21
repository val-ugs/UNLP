import React from 'react';
import i18n from 'localization/i18n';
import AppRouter from './components/AppRouter';
import AppModals from './components/AppModals';
import './styles.scss';

const App = () => {
  i18n.language; // is needed to set the language

  return (
    <div className="app">
      <AppRouter />
      <AppModals />
    </div>
  );
};

export default App;
