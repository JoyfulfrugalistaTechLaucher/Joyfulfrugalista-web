"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addEntryToDatabase } from '../components/FirebaseDatabase';
import BackgroundWrapper from "../components/BackgroundWrapper";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [amount, setAmount] = useState<string>('0');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());
    const [description, setDescription] = useState<string>('');

    const { uid } = useAuth(); // 获取当前用户的 UID

    const handleSave = () => {
        if (uid && selectedCategory) {
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

            // 保存数据到数据库
            addEntryToDatabase(uid, formattedDate, amount, selectedCategory, description)
                .then(() => {
                    toast.success('Entry added successfully!', {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    // 清空输入框和选择的分类
                    setAmount('0');
                    setSelectedCategory(null);
                    setDescription('');
                })
                .catch((error) => {
                    toast.error(`Error adding entry: ${error.message}`, {
                        position: "top-center",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                });
        } else {
            toast.error('UID or selected category is missing', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
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
            <BackgroundWrapper>
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
                        {/* 金额输入框 */}
                        <input
                            type="number"
                            style={styles.amountInput}
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        {/* 描述输入框 */}
                        <input
                            type="text"
                            style={styles.descriptionInput}
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* 保存按钮 */}
                    <div style={styles.saveButtonContainer}>
                        <button style={styles.saveButton} onClick={handleSave}>
                            Save
                        </button>
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
            </BackgroundWrapper>
            <ToastContainer />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center',
        width: '600px',
        height: '100vh', // 限制容器高度为视口高度
        overflow: 'hidden', // 隐藏任何可能的溢出
    } as React.CSSProperties,
    scrollView: {
        overflowY: 'hidden', // 禁用滚动条
        height: '100%', // 确保内容高度适应容器高度
        width: '100%',
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
        backgroundColor: 'transparent',
        width: '93%',
    } as React.CSSProperties,
    amountInput: {
        width: '100%',
        padding: '10px',
        marginTop: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '20px',
    } as React.CSSProperties,
    descriptionInput: {
        width: '100%',
        padding: '10px',
        marginTop: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '16px',
    } as React.CSSProperties,
    saveButtonContainer: {
        padding: '10px',
    } as React.CSSProperties,
    saveButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '18px',
        cursor: 'pointer',
    } as React.CSSProperties,
    datePickerContainer: {
        padding: '10px',
        width: '93%',
    } as React.CSSProperties,
    datePicker: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    } as React.CSSProperties,
};


export default App;
