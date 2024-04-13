import React, { FC, useState } from 'react';
import { NlpConstructorNode } from 'pages/NlpConstructorPage/reactFlowNodes/nlpConstructorNodeTypes';
import OrderedList from 'components/common/OrderedList';
import Button from 'components/common/Button';
import Dropdown from 'components/common/Dropdown';
import './styles.scss';

interface NodeGroupMenuProps {
  groupTitle: string;
  listOfNodes: NlpConstructorNode[];
  addNodeByType: (nodeType: string) => void;
}

const NodeGroupMenu: FC<NodeGroupMenuProps> = ({
  groupTitle,
  listOfNodes,
  addNodeByType,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleMouseOver = () => {
    setIsOpen(true);
  };
  const handleMouseOut = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="node-group-menu"
      onMouseOver={handleMouseOver}
      onFocus={handleMouseOver}
      onMouseOut={handleMouseOut}
      onBlur={handleMouseOut}
    >
      <div className={`node-group-menu__group-title ${isOpen ? 'active' : ''}`}>
        {groupTitle} {'>'}
      </div>
      <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
        <OrderedList className="node-group-menu__nodes" type="none">
          {listOfNodes.map((nlpConstructorNode: NlpConstructorNode) => (
            <OrderedList.Item
              className="node-group-menu__node"
              key={nlpConstructorNode.name}
            >
              <Button
                className="node-group-menu__button"
                onClick={() => {
                  addNodeByType(nlpConstructorNode.node.name);
                }}
              >
                {nlpConstructorNode.name}
              </Button>
            </OrderedList.Item>
          ))}
        </OrderedList>
      </Dropdown>
    </div>
  );
};

export default NodeGroupMenu;
