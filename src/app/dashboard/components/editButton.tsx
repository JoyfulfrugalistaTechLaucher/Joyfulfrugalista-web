// components/EditButton.tsx
import React from 'react';

interface EditButtonProps {
    editMode: boolean;
    toggleEditMode: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ editMode, toggleEditMode }) => {
    return (
        <button
            onClick={toggleEditMode}
            style={{
                position: 'fixed',
                top: '140px',
                right: '200px',
                zIndex: 1000,
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: editMode ? '#4CAF50' : '#f0f0f0',
                color: editMode ? 'white' : 'black',
                border: 'none',
                cursor: 'pointer'
            }}
        >
            {editMode ? 'Done' : 'Edit'}
        </button>
    );
};

export default EditButton;
