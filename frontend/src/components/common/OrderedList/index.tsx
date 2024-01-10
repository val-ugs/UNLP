import React, { FC, ReactNode } from 'react';
import { getChildrenByName } from '../../_extensions/childrenExtension';
import './styles.scss';

export interface OrderedListProps {
  className?: string;
  type?:
    | 'armenian'
    | 'decimal'
    | 'decimal-leading-zero'
    | 'georgian'
    | 'lower-alpha'
    | 'lower-greek'
    | 'lower-latin'
    | 'lower-roman'
    | 'upper-alpha'
    | 'upper-roman'
    | 'inherit'
    | 'none';
  reversed?: boolean;
  start?: number;
  children: ReactNode;
}

const OrderedList = ({
  className,
  type = 'decimal',
  reversed,
  start,
  children,
}: OrderedListProps) => {
  const items = getChildrenByName(children, Item);

  return (
    <>
      <ol
        className={`ordered-list ordered-list-${type} ${className}`}
        reversed={reversed}
        start={start}
      >
        {items}
      </ol>
    </>
  );
};

export interface OrderedListItemProps {
  className?: string;
  children: ReactNode;
}

const Item: FC<OrderedListItemProps> = ({ className, children }) => {
  return (
    <>
      <li className={`ordered-list-item ${className}`}>{children}</li>
    </>
  );
};

OrderedList.Item = Item;

export default OrderedList;
