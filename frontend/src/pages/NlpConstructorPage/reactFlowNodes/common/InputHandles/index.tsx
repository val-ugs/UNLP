import React, { FC, ReactNode } from 'react';
import { Handle as ReactFlowHandle, Position } from 'reactflow';
import { getChildrenByName } from 'components/_extensions/childrenExtension';
import './styles.scss';

interface InputHandlesProps {
  className?: string;
  children: ReactNode;
}

const InputHandles = ({ className, children }: InputHandlesProps) => {
  const handles = getChildrenByName(children, Handle);
  return (
    <>
      <div className={`input-handles ${className}`}>{handles}</div>
    </>
  );
};

export interface InputHandlesItemProps {
  className?: string;
  id: string;
  pos?: number;
}

const Handle: FC<InputHandlesItemProps> = ({ className, id, pos }) => {
  return (
    <div className={`input-handles-item ${className}`}>
      <div className="input-handles-item__id">{id}</div>
      <ReactFlowHandle
        type={'target'}
        position={Position.Left}
        className="input-handles-item__handle"
        id={id}
        style={{ top: pos }}
      />
    </div>
  );
};

InputHandles.Handle = Handle;

export default InputHandles;
