import { Children, isValidElement, ReactNode } from 'react';

export const getChildrenByName = (children: ReactNode, item: any) => {
  return Children.map(children, (child) =>
    isValidElement(child) &&
    typeof child.type !== 'string' &&
    child.type.name === item.name
      ? child
      : null
  );
};
