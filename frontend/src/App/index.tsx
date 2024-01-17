import React from 'react';
import AppRouter from './components/AppRouter';
import AppModals from './components/AppModals';
import './styles.scss';

const App = () => {
  return (
    <div className="app">
      <AppRouter />
      <AppModals />
    </div>
  );
};

export default App;
