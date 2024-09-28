import React from 'react';

interface CategoryButtonProps {
    iconName: string;
    title: string;
    onPress: () => void;
    color: string;
    isSelected: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ iconName, title, onPress, color, isSelected }) => {
    const buttonStyles: React.CSSProperties = {
        backgroundColor: color,
        borderColor: isSelected ? '#480076' : 'transparent',
        borderWidth: isSelected ? '2px' : '0',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px',
        width: '22%',
        height: '92px',
        borderRadius: '20px',
        margin: '5px',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
    };

    const iconStyles: React.CSSProperties = {
        width: '50px',
        height: '50px',
    };

    const textStyles: React.CSSProperties = {
        marginTop: '5px',
        color: '#333',
        fontSize: '12px',
        textAlign: 'center',
    };

    return (
        <div style={buttonStyles} onClick={onPress}>
            <img src={iconName} alt={title} style={iconStyles} />
            <span style={textStyles}>{title}</span>
        </div>
    );
};

export default CategoryButton;
