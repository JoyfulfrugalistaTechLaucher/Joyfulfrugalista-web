"use client";

import React, { useState } from 'react';

interface Category {
    id: string;
    title: string;
    iconName: string;
    color: string;
}

export const categories: Category[] = [
    { id: 'Housing', title: 'Housing', iconName: '/assets/housing.png', color: '#D0C6E1' },
    { id: 'Household', title: 'Household', iconName: '/assets/household.png', color: '#F1EBF2' },
    { id: 'Utilities', title: 'Utilities', iconName: '/assets/utilities.png', color: '#C4D3EB' },
    { id: 'Transport', title: 'Transport', iconName: '/assets/transport.png', color: '#D0ECF3' },
    { id: 'Leisure', title: 'Leisure', iconName: '/assets/leisure.png', color: '#D6E4F2' },
    { id: 'Holidays', title: 'Holidays', iconName: '/assets/holidays.png', color: '#BCE1D6'},
    { id: 'Wellbeing', title: 'Wellbeing', iconName: '/assets/wellbeing.png', color: '#E6D6FF' },
    { id: 'Education', title: 'Education', iconName: '/assets/education.png', color: '#F5C4DB' },
    { id: 'Grooming', title: 'Grooming', iconName: '/assets/grooming.png', color: '#E8CCFF' },
    { id: 'Gifts', title: 'Gifts', iconName: '/assets/gifts.png', color: '#FFCCCC' },
    { id: 'Christmas', title: 'Christmas', iconName: '/assets/christmas.png', color: '#CCF5E1' },
    { id: 'Insurance', title: 'Insurance', iconName: '/assets/insurance.png', color: '#F7E8E4' },
    { id: 'Childcare', title: 'Childcare', iconName: '/assets/childcare.png', color: '#FFE6CC' },
    { id: 'Food', title: 'Food', iconName: '/assets/food.png', color: '#BCE1D6' },
    { id: 'Health', title: 'Health', iconName: '/assets/health.png', color: '#C5E1BA' },
    { id: 'Appearance', title: 'Appearance', iconName: '/assets/appearance.png', color: '#F7E8E4' },
    { id: 'Lifestyle', title: 'Lifestyle', iconName: '/assets/lifestyle.png', color: '#F4EB85' },
    { id: 'Treat yourself', title: 'Treat yourself', iconName: '/assets/treatyourself.png', color: '#F0EAD6' },
];

const App: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('0');
    const [previousValue, setPreviousValue] = useState<string | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());
    const [description, setDescription] = useState<string>('');

    const handleButtonPress = (value: string) => {
        if (value === 'Back') {
            setInputValue(inputValue.slice(0, -1) || '0');
        } else if (value === 'Done') {
            let result = inputValue;
            if (operator && previousValue !== null) {
                result = String(calculate(parseFloat(previousValue), parseFloat(inputValue), operator)); // Convert number to string
                setPreviousValue(null);
                setOperator(null);
            }
            setInputValue(result);
            // 在此处可以添加保存到数据库的逻辑
        } else if (['+', '-'].includes(value)) {
            if (operator && previousValue !== null) {
                const result = String(calculate(parseFloat(previousValue), parseFloat(inputValue), operator)); // Convert number to string
                setPreviousValue(result);
                setInputValue('0');
                setOperator(value);
            } else {
                setPreviousValue(inputValue);
                setInputValue('0');
                setOperator(value);
            }
        } else if (!isNaN(parseFloat(value)) || (value === '.' && !inputValue.includes('.'))) {
            setInputValue((inputValue === '0' && value !== '.') ? value : inputValue + value);
        }
    };

    const calculate = (a: number, b: number, operator: string): number => {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            default:
                return b;
        }
    };

    const handleCategoryPress = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDate(new Date(event.target.value));
    };

    return (
        <div style={styles.container}>
            <div style={styles.scrollView}>
                {/* 类别按钮 */}
                <div style={styles.categoryContainer}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            style={{
                                ...styles.categoryButton,
                                backgroundColor: category.color,
                                border: selectedCategory === category.id ? '2px solid #000' : 'none',
                            }}
                            onClick={() => handleCategoryPress(category.id)}
                        >
                            <img src={category.iconName} alt={category.title} style={styles.icon} />
                            <span>{category.title}</span>
                        </div>
                    ))}
                </div>

                <div style={styles.inputContainer}>
                    {/* 显示输入值 */}
                    <span style={styles.inputDisplay}>{inputValue}</span>
                    {/* 描述输入框 */}
                    <input
                        type="text"
                        style={styles.descriptionInput}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* 按键区 */}
                <div style={styles.keypadContainer}>
                    <div style={styles.keypad}>
                        {['7', '8', '9', '+', '4', '5', '6', '-', '1', '2', '3', '0', '.', 'Back', 'Done'].map(label => (
                            <button
                                key={label}
                                style={styles.keypadButton}
                                onClick={() => handleButtonPress(label)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 日期选择器 */}
                <div style={styles.datePickerContainer}>
                    <input
                        type="date"
                        value={date.toISOString().substr(0, 10)}
                        onChange={handleDateChange}
                        style={styles.datePicker}
                    />
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
    } as React.CSSProperties,
    scrollView: {
        overflowY: 'scroll',
        height: '100vh',
    } as React.CSSProperties,
    categoryContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: '10px',
        justifyContent: 'center',
    } as React.CSSProperties,
    categoryButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        borderRadius: '8px',
        margin: '10px',
        textAlign: 'center',
        cursor: 'pointer',
        width: '80px',
    } as React.CSSProperties,
    icon: {
        width: '50px',
        height: '50px',
        marginBottom: '5px',
    } as React.CSSProperties,
    inputContainer: {
        padding: '10px',
        backgroundColor: '#29144A',
    } as React.CSSProperties,
    inputDisplay: {
        fontSize: '30px',
        color: '#fff',
        textAlign: 'right',
        padding: '10px',
        backgroundColor: '#29144A',
    } as React.CSSProperties,
    descriptionInput: {
        width: '100%',
        padding: '10px',
        marginTop: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    } as React.CSSProperties,
    keypadContainer: {
        padding: '10px',
        backgroundColor: '#29144A',
    } as React.CSSProperties,
    keypad: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    } as React.CSSProperties,
    keypadButton: {
        padding: '20px',
        margin: '5px',
        fontSize: '18px',
        borderRadius: '8px',
        backgroundColor: '#f0f0f0',
        cursor: 'pointer',
    } as React.CSSProperties,
    datePickerContainer: {
        padding: '10px',
    } as React.CSSProperties,
    datePicker: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    } as React.CSSProperties,
};

export default App;
