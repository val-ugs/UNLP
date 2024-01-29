import { FC, ReactNode } from 'react';

import './styles.scss';
import { useClickOutside } from 'hooks/useClickOutside';

interface DropdownProps {
  className?: string;
  contentClassName?: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
  children: ReactNode;
}

const Dropdown: FC<DropdownProps> = ({
  className,
  contentClassName,
  isOpen,
  setIsOpen,
  onClose,
  children,
}) => {
  const handleClick = () => {
    if (isOpen) {
      onClose?.();
      setIsOpen(false);
    }
  };
  const ref = useClickOutside(handleClick);
  return (
    <>
      {isOpen && (
        <div className={`dropdown ${className}`} ref={ref}>
          <div className={`dropdown__content ${contentClassName}`}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Dropdown;
