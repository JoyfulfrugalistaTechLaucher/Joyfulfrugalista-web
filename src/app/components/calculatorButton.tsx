import React from 'react';

interface CalculatorButtonProps {
    label: string;
    onPress: (label: string) => void;
    type: 'number' | 'operator' | 'date' | 'backspace' | 'done';
    imageSource?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ label, onPress, type, imageSource }) => {
    const content = imageSource ? (
        <img src={imageSource} alt={label} style={styles.imageStyle} />
    ) : (
        <span style={styles.buttonText}>{label}</span>
    );

    return (
        <button
            style={{ ...styles.button, ...styles[type] }}
            onClick={() => onPress(label)}
        >
            {content}
        </button>
    );
};

const styles = {
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        margin: '6px',
        minWidth: '20%',
        borderRadius: '10px',
        height: '60px',
        border: 'none', // 移除默认 button 的边框
        cursor: 'pointer',
    } as React.CSSProperties,
    number: { // Number buttons
        backgroundColor: '#F6E9DC',
    },
    operator: { // Operators like +, -
        backgroundColor: '#F6E9DC',
    },
    date: { // Date button
        backgroundColor: '#F6E9DC',
    },
    backspace: { // Backspace button
        backgroundColor: '#F6E9DC',
    },
    done: { // Done button
        backgroundColor: '#F2C875',
    },
    buttonText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
    } as React.CSSProperties,
    imageStyle: {
        width: '25px',
        height: '25px',
        objectFit: 'contain',
    } as React.CSSProperties,
};

export default CalculatorButton;
