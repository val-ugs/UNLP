import React, { FC, ReactNode, useMemo } from 'react';
import { useAppSelector } from 'hooks/redux';
import {
  Handle as ReactFlowHandle,
  Position,
  getConnectedEdges,
  useNodeId,
} from 'reactflow';
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
  limit?: number;
  pos?: number;
}

const Handle: FC<InputHandlesItemProps> = ({
  className,
  id,
  limit = 1,
  pos,
}) => {
  const nodeId = useNodeId();

  const { nodes, edges } = useAppSelector((state) => state.reactFlowReducer);
  const isHandleConnectable = useMemo(() => {
    const node = nodes.find((n) => n.id == nodeId);
    if (!node) return false;

    const connectedEdges = getConnectedEdges([node], edges).filter(
      (edge) => edge.target === nodeId && edge.targetHandle === id
    );

    return connectedEdges.length < limit;
  }, [edges, id, limit, nodeId, nodes]);

  return (
    <div className={`input-handles-item ${className}`}>
      <div className="input-handles-item__id">{id}</div>
      <ReactFlowHandle
        type={'target'}
        position={Position.Left}
        className="input-handles-item__handle"
        id={id}
        isConnectable={isHandleConnectable}
        style={{ top: pos }}
      />
    </div>
  );
};

InputHandles.Handle = Handle;

export default InputHandles;
