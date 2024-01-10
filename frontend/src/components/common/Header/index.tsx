import React, { FC } from 'react';
import OrderedList from '../OrderedList';
import NavLinkButton, { NavLinkButtonProps } from '../NavLinkButton';
import './styles.scss';

const navLinkButtons: NavLinkButtonProps[] = [
  {
    to: '/prepare',
    children: 'Prepare dataset',
  },
  {
    to: '/nlp',
    children: 'NLP',
  },
  {
    to: '/nlp-pipeline',
    children: 'NLP Pipeline',
  },
];

const Header: FC = () => {
  return (
    <header className="header">
      <div className="header__item header__title">UNLP</div>
      <OrderedList type={'none'} className="header__nav-list">
        {navLinkButtons?.map((item: NavLinkButtonProps, index: number) => (
          <OrderedList.Item className="header__nav-item" key={index}>
            <NavLinkButton
              className={window.location.pathname == item.to ? 'active' : ''}
              to={item.to}
            >
              {item.children}
            </NavLinkButton>
          </OrderedList.Item>
        ))}
      </OrderedList>
    </header>
  );
};

export default Header;
