import React, { useState } from 'react';
import { ExpandMore, ChevronRight, InsertDriveFile, Delete, Add } from '@material-ui/icons';
import './App.css';

const FileNode = ({ node, depth, onDelete, onCreateFolder, onCreateFile, onRename }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nodeName, setNodeName] = useState(node.name);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    onDelete(node.id);
  };

  const handleRename = () => {
    setIsRenaming(true);
  };

  const handleRenameSubmit = () => {
    if (nodeName.trim() === '') {
      alert('Please provide a valid name.');
      return;
    }
    onRename(node.id, nodeName);
    setIsRenaming(false);
  };

  const handleCreateFolder = () => {
    onCreateFolder(node.id);
  };

  const handleCreateFile = () => {
    onCreateFile(node.id);
  };

  return (
    <div style={{ paddingLeft: `${depth * 20}px` }}>
      <div className="node">
        {node.type === 'folder' ? (
          <div onClick={handleToggle} style={{ display: 'inline-block', marginRight: '5px' }}>
            {isOpen ? <ExpandMore /> : <ChevronRight />}
          </div>
        ) : (
          <InsertDriveFile />
        )}
        {isRenaming ? (
          <div className="node-name">
            <input
              type="text"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit();
                }
              }}
              onBlur={handleRenameSubmit}
            />
          </div>
        ) : (
          <div className="node-name" onClick={handleRename}>
            {node.name}
          </div>
        )}
        <div className="node-controls">
          {isRenaming && (
            <button className="control-button" onClick={handleRenameSubmit}>
              Save
            </button>
          )}
          <button className="control-button" onClick={handleDelete}>
            <Delete />
          </button>
          {node.type === 'folder' && (
            <button className="control-button" onClick={handleCreateFolder}>
              <Add />
            </button>
          )}
          {!isRenaming && node.type === 'folder' && (
            <button className="control-button" onClick={handleCreateFile}>
              <InsertDriveFile />
            </button>
          )}
        </div>
      </div>
      {node.type === 'folder' && isOpen && (
        <div>
          {node.children.map((childNode) => (
            <FileNode
              key={childNode.id}
              node={childNode}
              depth={depth + 1}
              onDelete={onDelete}
              onCreateFolder={onCreateFolder}
              onCreateFile={onCreateFile}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const initialFileStructure = {
  id: 'root',
  name: 'root',
  type: 'folder',
  children: [
    {
      id: 'folder1',
      name: 'Folder 1',
      type: 'folder',
      children: [
        {
          id: 'file1',
          name: 'File 1',
          type: 'file',
        },
      ],
    },
    {
      id: 'file2',
      name: 'File 2',
      type: 'file',
    },
  ],
};

function App() {
  const [fileStructure, setFileStructure] = useState(initialFileStructure);

  const handleDeleteNode = (nodeId) => {
    const updatedStructure = deleteNodeById(fileStructure, nodeId);
    setFileStructure(updatedStructure);
  };

  const handleCreateFolder = (parentId) => {
    const newNode = {
      id: `${parentId}-${Date.now()}`,
      name: 'New Folder',
      type: 'folder',
      children: [],
    };
    const updatedStructure = createNodeById(fileStructure, parentId, newNode);
    setFileStructure(updatedStructure);
  };

  const handleCreateFile = (parentId) => {
    const newNode = {
      id: `${parentId}-${Date.now()}`,
      name: 'New File',
      type: 'file',
    };
    const updatedStructure = createNodeById(fileStructure, parentId, newNode);
    setFileStructure(updatedStructure);
  };

  const handleRenameNode = (nodeId, newName) => {
    const updatedStructure = renameNodeById(fileStructure, nodeId, newName);
    setFileStructure(updatedStructure);
  };

  const deleteNodeById = (node, nodeId) => {
    if (node.id === nodeId) {
      // If the node to delete is found, return null to remove it from the parent's children array
      return null;
    } else if (node.type === 'folder') {
      const updatedChildren = node.children.map((childNode) => deleteNodeById(childNode, nodeId));
      return {
        ...node,
        children: updatedChildren.filter((child) => child !== null), // Filter out null values (deleted nodes)
      };
    } else {
      return node;
    }
  };

  const createNodeById = (node, parentId, newNode) => {
    if (node.id === parentId) {
      return { ...node, children: [...node.children, newNode] };
    } else if (node.type === 'folder') {
      return { ...node, children: node.children.map((childNode) => createNodeById(childNode, parentId, newNode)) };
    } else {
      return node;
    }
  };

  const renameNodeById = (node, nodeId, newName) => {
    if (node.id === nodeId) {
      return { ...node, name: newName };
    } else if (node.type === 'folder') {
      return { ...node, children: node.children.map((childNode) => renameNodeById(childNode, nodeId, newName)) };
    } else {
      return node;
    }
  };

  return (
    <div className="App">
      <FileNode
        node={fileStructure}
        depth={0}
        onDelete={handleDeleteNode}
        onCreateFolder={handleCreateFolder}
        onCreateFile={handleCreateFile}
        onRename={handleRenameNode}
      />
    </div>
  );
}

export default App;
