import React, { FC, ReactNode } from 'react';
import { getChildrenByName } from '../../_extensions/childrenExtension';
import './styles.scss';

export interface UnorderedListProps {
  className?: string;
  type?: 'circle' | 'disc' | 'square';
  children: ReactNode;
}

const UnorderedList = ({
  className,
  type = 'circle',
  children,
}: UnorderedListProps) => {
  const items = getChildrenByName(children, Item);

  return (
    <>
      <ol
        style={{ listStyleType: type }}
        className={`unordered-list unordered-list-${type} ${className}`}
      >
        {items}
      </ol>
    </>
  );
};

export interface UnorderedListItemProps {
  className?: string;
  children: ReactNode;
}

const Item: FC<UnorderedListItemProps> = ({ className, children }) => {
  return (
    <>
      <li className={`unordered-list-item ${className}`}>{children}</li>
    </>
  );
};

UnorderedList.Item = Item;

export default UnorderedList;
