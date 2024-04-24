import React, {
  ReactNode,
  useState,
  createContext,
  useContext,
  MouseEvent,
} from 'react';
import { getChildrenByName } from '../../_extensions/childrenExtension';
import Arrow, { ArrowDirectionEnum } from '../Arrow';
import Counter from '../Counter';
import './styles.scss';

interface SelectContextProps<T extends number | string> {
  selectedValues: T[];
  handleChangeValue: (value: T) => void;
}

const SelectContext = createContext<SelectContextProps<any>>({
  selectedValues: [],
  handleChangeValue: () => undefined,
});

export interface MultiselectProps<T extends number | string> {
  className?: string;
  selectedValues: T[];
  setSelectedValues: (values: T[]) => void;
  maxLength?: number;
  children: ReactNode;
  disabled?: boolean;
}

const Multiselect = <T extends number | string>({
  className,
  selectedValues,
  setSelectedValues,
  maxLength,
  children,
  disabled,
}: MultiselectProps<T>) => {
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
    const array: T[] = [...selectedValues];

    if (array.includes(value))
      setSelectedValues(array.filter((val: T) => val != value));
    else {
      if (maxLength && array.length >= maxLength) return array;

      array.push(value);
      setSelectedValues(array);
    }

    setIsOpenDropdown(false);
  };

  return (
    <div className={`multiselect ${className}`} onBlur={handleBlur}>
      <button
        className={`multiselect__selected ${disabled ? 'disabled' : ''}`}
        type="button"
        disabled={disabled}
        onClick={handleClick}
      >
        <div className="multiselect__selected-wrapper">
          <div className="multiselect__selected-left">
            <div className="multiselect__selected-values">
              {selectedValues?.map((selectedValue) => (
                <span
                  className="multiselect__selected-value"
                  key={selectedValue}
                >
                  {itemDictionary[selectedValue]}
                  {selectedValue != selectedValues[selectedValues.length - 1]
                    ? ', '
                    : ''}
                </span>
              ))}
            </div>
            <span className="multiselect__selected-arrow">
              <Arrow
                className="multiselect__arrow"
                direction={
                  isOpenDropdown
                    ? ArrowDirectionEnum.Up
                    : ArrowDirectionEnum.Down
                }
              />
            </span>
          </div>
          {maxLength && maxLength > 0 && (
            <div className="multiselect__selected-right">
              <Counter
                className="multiselect__counter"
                value={selectedValues.length}
                maxValue={maxLength}
              />
            </div>
          )}
        </div>
      </button>
      {isOpenDropdown && (
        <SelectContext.Provider value={{ selectedValues, handleChangeValue }}>
          <div className="multiselect__items">{items}</div>
        </SelectContext.Provider>
      )}
    </div>
  );
};

export interface MultiselectItemProps<T extends number | string> {
  className?: string;
  value: T;
  children: ReactNode;
}

const Item = <T extends number | string>({
  className,
  value,
  children,
}: MultiselectItemProps<T>) => {
  const { selectedValues, handleChangeValue } =
    useContext<SelectContextProps<T>>(SelectContext);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleChangeValue(value);
  };

  return (
    <button
      className={`multiselect-item ${className} ${
        selectedValues.includes(value) ? 'active' : ''
      }`}
      onMouseDown={handleClick}
    >
      {children}
    </button>
  );
};

Multiselect.Item = Item;

export default Multiselect;
