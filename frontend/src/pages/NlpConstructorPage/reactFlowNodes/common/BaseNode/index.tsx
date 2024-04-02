import React, { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import InputHandles, { InputHandlesItemProps } from '../InputHandles';
import OutputHandles, { OutputHandlesItemProps } from '../OutputHandles';
import './styles.scss';

interface BaseNodeProps {
  className?: string;
  inputHandles?: InputHandlesItemProps[];
  outputHandles?: OutputHandlesItemProps[];
  children: ReactNode;
}

const BaseNode: FC<BaseNodeProps> = ({
  className,
  inputHandles,
  outputHandles,
  children,
}) => {
  const nodeRef = useRef(null);
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (nodeRef.current) {
      setHeight(nodeRef.current.offsetHeight);
    }
  }, []);

  return (
    <div className={`base-node ${className}`} ref={nodeRef}>
      {inputHandles && (
        <InputHandles className="base-node__input-handles">
          {inputHandles.map((inputHandle, index) => (
            <InputHandles.Handle
              className={inputHandle.className}
              id={inputHandle.id}
              limit={inputHandle.limit}
              pos={
                height / (2 * inputHandles.length) +
                (index * height) / inputHandles.length
              }
              key={index}
            />
          ))}
        </InputHandles>
      )}
      <div className="base-node__main">{children}</div>
      {outputHandles && (
        <OutputHandles className="base-node__output-handles">
          {outputHandles.map((outputHandle, index) => (
            <OutputHandles.Handle
              className={outputHandle.className}
              id={outputHandle.id}
              limit={outputHandle.limit}
              pos={
                height / (2 * outputHandles.length) +
                (index * height) / outputHandles.length
              }
              key={index}
            />
          ))}
        </OutputHandles>
      )}
    </div>
  );
};

export default BaseNode;
