import React, { FC, ReactNode } from 'react';
import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import './styles.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout__content">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
