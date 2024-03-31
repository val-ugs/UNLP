import React, { FC, ReactNode } from 'react';
import { Handle as ReactFlowHandle, Position } from 'reactflow';
import { getChildrenByName } from 'components/_extensions/childrenExtension';
import './styles.scss';

interface OutputHandlesProps {
  className?: string;
  children: ReactNode;
}

const OutputHandles = ({ className, children }: OutputHandlesProps) => {
  const handles = getChildrenByName(children, Handle);
  return (
    <>
      <div className={`output-handles ${className}`}>{handles}</div>
    </>
  );
};

export interface OutputHandlesItemProps {
  className?: string;
  id: string;
  pos?: number;
}

const Handle: FC<OutputHandlesItemProps> = ({ className, id, pos }) => {
  return (
    <div className={`output-handles-item ${className}`}>
      <div className="output-handles-item__id">{id}</div>
      <ReactFlowHandle
        type={'source'}
        position={Position.Right}
        className="output-handles-item__handle"
        id={id}
        style={{ top: pos }}
      />
    </div>
  );
};

OutputHandles.Handle = Handle;

export default OutputHandles;
