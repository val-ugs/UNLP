import React, { FC, ReactNode, useState } from 'react';
import './styles.scss';

export interface AccordionProps {
  className: string;
  header: ReactNode;
  children: ReactNode;
}

const Accordion: FC<AccordionProps> = ({ className, header, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion ${className}`}>
      <button className="accordion__header" onClick={handleClick}>
        <div className="accordion__header-title">{header}</div>
        <div className="accordion__header-toggle">{isOpen ? '-' : '+'}</div>
      </button>
      {isOpen && <div className="accordion__content">{children}</div>}
    </div>
  );
};

export default Accordion;
