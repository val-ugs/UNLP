import { FC, ReactNode } from 'react';

import './styles.scss';

interface DropdownProps {
  className?: string;
  contentClassName?: string;
  isOpen: boolean;
  children: ReactNode;
}

const Dropdown: FC<DropdownProps> = ({
  className,
  contentClassName,
  isOpen,
  children,
}) => {
  return (
    <div className={`dropdown ${className}`}>
      <div className={`dropdown__content ${contentClassName}`}>
        {isOpen && children}
      </div>
    </div>
  );
};

export default Dropdown;
