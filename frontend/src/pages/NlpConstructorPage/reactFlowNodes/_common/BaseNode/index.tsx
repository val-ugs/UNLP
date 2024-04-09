import React, { FC, ReactNode, useLayoutEffect, useRef, useState } from 'react';
import InputHandles, { InputHandlesItemProps } from '../InputHandles';
import OutputHandles, { OutputHandlesItemProps } from '../OutputHandles';
import './styles.scss';

interface BaseNodeProps {
  className?: string;
  inputHandles?: InputHandlesItemProps[];
  outputHandles?: OutputHandlesItemProps[];
  running: boolean;
  children: ReactNode;
}

const BaseNode: FC<BaseNodeProps> = ({
  className,
  inputHandles,
  outputHandles,
  running,
  children,
}) => {
  const nodeRef = useRef(null);
  const [height, setHeight] = useState<number>(0);

  useLayoutEffect(() => {
    if (!nodeRef.current) return;

    setHeight(nodeRef.current.offsetHeight);
  }, []);

  return (
    <div className={`base-node ${className}`} ref={nodeRef}>
      <div className="base-node__animated-border-wrapper">
        {running && (
          <div
            className={'base-node__animated-border'}
            style={{
              width: Math.max(
                nodeRef.current?.offsetHeight,
                nodeRef.current?.offsetWidth
              ),
              height: Math.max(
                nodeRef.current?.offsetHeight,
                nodeRef.current?.offsetWidth
              ),
              top:
                nodeRef.current?.offsetWidth > nodeRef.current?.offsetHeight
                  ? -0.5 * nodeRef.current?.offsetWidth +
                    0.5 * nodeRef.current?.offsetHeight
                  : 0,
              left:
                nodeRef.current?.offsetHeight > nodeRef.current?.offsetWidth
                  ? -0.5 * nodeRef.current?.offsetHeight +
                    0.5 * nodeRef.current?.offsetWidth
                  : 0,
            }}
          ></div>
        )}
      </div>
      <div className="base-node__content">
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
    </div>
  );
};

export default BaseNode;
