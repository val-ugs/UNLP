import React, { FC, ReactNode, useState } from 'react';
import './styles.scss';

export interface AccordionProps {
  className: string;
  header: ReactNode;
  isOpenOnStart?: boolean;
  children: ReactNode;
}

const Accordion: FC<AccordionProps> = ({
  className,
  header,
  isOpenOnStart = true,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(isOpenOnStart);
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
