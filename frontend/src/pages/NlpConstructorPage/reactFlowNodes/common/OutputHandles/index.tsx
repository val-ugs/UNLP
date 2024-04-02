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
  limit?: number;
  pos?: number;
}

const Handle: FC<OutputHandlesItemProps> = ({
  className,
  id,
  limit = 1,
  pos,
}) => {
  const nodeId = useNodeId();
  const { nodes, edges } = useAppSelector((state) => state.reactFlowReducer);
  const isHandleConnectable = useMemo(() => {
    const node = nodes.find((n) => n.id == nodeId)!;
    const connectedEdges = getConnectedEdges([node], edges);

    return connectedEdges.length < limit;
  }, [edges, limit, nodeId, nodes]);

  return (
    <div className={`output-handles-item ${className}`}>
      <div className="output-handles-item__id">{id}</div>
      <ReactFlowHandle
        type={'source'}
        position={Position.Right}
        className="output-handles-item__handle"
        id={id}
        isConnectable={isHandleConnectable}
        style={{ top: pos }}
      />
    </div>
  );
};

OutputHandles.Handle = Handle;

export default OutputHandles;
