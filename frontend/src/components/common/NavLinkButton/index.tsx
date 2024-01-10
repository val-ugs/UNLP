import React, { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import './styles.scss';

export interface NavLinkButtonProps {
  className?: string;
  to: string;
  children: ReactNode;
}

const NavLinkButton: FC<NavLinkButtonProps> = ({ to, children, className }) => {
  return (
    <NavLink className={`nav-link-button ${className}`} to={to}>
      <button className="nav-link-button__button">{children}</button>
    </NavLink>
  );
};

export default NavLinkButton;
