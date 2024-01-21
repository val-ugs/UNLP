import React, {
  ReactNode,
  useState,
  createContext,
  useContext,
  MouseEvent,
} from 'react';
import { getChildrenByName } from '../../_extensions/childrenExtension';
import Arrow, { ArrowDirectionEnum } from '../../common/Arrow';
import './styles.scss';

interface SelectContextProps<T extends number | string> {
  selectedValue: T;
  handleChangeValue: (value: T) => void;
}
const SelectContext = createContext<SelectContextProps<any>>({
  selectedValue: 1,
  handleChangeValue: () => undefined,
});

export interface SelectProps<T extends number | string> {
  className?: string;
  selectedValue: T;
  setSelectedValue: (value: T) => void;
  children: ReactNode;
  disabled?: boolean;
}

const Select = <T extends number | string>({
  className,
  selectedValue,
  setSelectedValue,
  children,
  disabled,
}: SelectProps<T>) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const items = getChildrenByName(children, Item);
  const itemDictionary = Object.fromEntries(
    items!.map((item: any) => [item.props.value, item.props.children])
  );
  disabled = disabled === true;

  const handleClick = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  const handleBlur = () => {
    setIsOpenDropdown(false);
  };

  const handleChangeValue = (value: T) => {
    setSelectedValue(value);
    setIsOpenDropdown(false);
  };

  return (
    <div className={`select ${className}`} onBlur={handleBlur}>
      <button
        className={`select__selected ${disabled ? 'disabled' : ''}`}
        type="button"
        disabled={disabled}
        onClick={handleClick}
      >
        <span className="select__selected-value">
          {itemDictionary[selectedValue]}
        </span>
        <span className="select__selected-arrow">
          <Arrow
            className="select__arrow"
            direction={
              isOpenDropdown ? ArrowDirectionEnum.Up : ArrowDirectionEnum.Down
            }
          />
        </span>
      </button>
      {isOpenDropdown && (
        <SelectContext.Provider value={{ selectedValue, handleChangeValue }}>
          <div className="select__items">{items}</div>
        </SelectContext.Provider>
      )}
    </div>
  );
};

export interface SelectItemProps<T extends number | string> {
  className?: string;
  value: T;
  children: ReactNode;
}

const Item = <T extends number | string>({
  className,
  value,
  children,
}: SelectItemProps<T>) => {
  const { selectedValue, handleChangeValue } =
    useContext<SelectContextProps<T>>(SelectContext);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleChangeValue(value);
  };

  return (
    <button
      className={`select-item ${className} ${
        value == selectedValue ? 'active' : ''
      }`}
      onMouseDown={handleClick}
    >
      {children}
    </button>
  );
};

Select.Item = Item;

export default Select;
