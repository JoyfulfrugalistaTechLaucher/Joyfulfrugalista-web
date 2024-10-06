"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addEntryToDatabase } from '../components/FirebaseDatabase';
import BackgroundWrapper from "../components/BackgroundWrapper";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { categories } from '@/data/Category';


const AddPage: React.FC = () => {
    const [amount, setAmount] = useState<string>('0');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [date, setDate] = useState<Date>(new Date());
    const [description, setDescription] = useState<string>('');

    const { uid } = useAuth(); // 获取当前用户的 UID

    const handleSave = () => {
        if (uid && selectedCategory) {
            const formattedDate = date.toISOString().substr(0, 10); 

            // 保存数据到数据库
            addEntryToDatabase(uid, formattedDate, amount, selectedCategory, description)
                .then(() => {
                    toast.success('已成功添加！', {
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
                    toast.error(`添加条目出错： ${error.message}`, {
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
            toast.error('缺少 UID 或所选类别', {
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
                            placeholder="数目"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        {/* 描述输入框 */}
                        <input
                            type="text"
                            style={styles.descriptionInput}
                            placeholder="描述"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* 保存按钮 */}
                    <div style={styles.saveButtonContainer}>
                        <button style={styles.saveButton} onClick={handleSave}>
                            保存
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
        width: '100%',
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
        width: '100%',
    } as React.CSSProperties,
    datePicker: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
    } as React.CSSProperties,
};


export default AddPage;