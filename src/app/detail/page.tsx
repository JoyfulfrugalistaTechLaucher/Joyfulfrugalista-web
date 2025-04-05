"use client";

import React, { useState, useEffect } from 'react';
import { categories } from '@/data/Category';
import Image from 'next/image';
import { fetchSavingData } from '../components/FirebaseDatabase';
import { useAuth } from '../context/AuthContext';
import BackgroundWrapper from "../components/DetailPageBackgroud";

interface FetchedData {
    savingEntries: Array<any>;
    totalSaved: number;
}

const Detail: React.FC = () => {
    const [dateIndex, setDateIndex] = useState(0);
    const [dataType, setDataType] = useState<string>("saving");
    const [fetchedData, setFetchedData] = useState<FetchedData>({
        savingEntries: [],
        totalSaved: 0,
    });
    const [totalSavingAmount, setTotalSavingAmount] = useState<number>(0);
    const [dailySavingAmount, setDailySavingAmount] = useState<number>(0);

    const getDate = (dateIndex: number): string => {
        const currentDate = new Date();
        const targetDate = new Date(currentDate);
        targetDate.setDate(currentDate.getDate() + dateIndex);

        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const day = targetDate.getDate();

        // 确保月份和日期有两位数
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        const formattedDay = day < 10 ? `0${day}` : `${day}`;

        return `${year}-${formattedMonth}-${formattedDay}`;
    };

    const handleDataChange = (data: string) => {
        setDataType(data);
    };

    const handlePrevious = () => {
        setDateIndex(dateIndex - 1);
    };

    const handleNext = () => {
        const today = new Date();
        const nextDate = new Date(getDate(dateIndex + 1));
        today.setHours(0, 0, 0, 0);
        nextDate.setHours(0, 0, 0, 0);
        if (nextDate <= today) {
            setDateIndex(prevIndex => prevIndex + 1);
        } else {
            console.log('Cannot navigate to a future date');
        }
    };

    useEffect(() => {
        fetchDataAndUpdate();
    }, [dateIndex]);

    const { uid, isLoggedIn } = useAuth();

    const fetchDataAndUpdate = () => {
        if (isLoggedIn && uid) {
            fetchSavingData(uid)
                .then((data: any) => {
                    setTotalSavingAmount(data.totalSaved);

                    const categorizedData = categorizeSavingEntries(data.savingEntries);
                    const currentData = getEntriesForDate(categorizedData, getDate(dateIndex));
                    setDailySavingAmount(calculateDailySavingAmount(currentData));

                    setFetchedData({
                        savingEntries: currentData,
                        totalSaved: data.totalSaved,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching saving data:", error);
                });
        } else {
            console.log('User is not logged in or UID is not available.');
        }
    };

    const categorizeSavingEntries = (savingEntries: Record<string, any>) => {
        const categorizedData: { [key: string]: any[] } = {};

        const entriesArray = Object.values(savingEntries);

        entriesArray.forEach((entry) => {
            const { date } = entry;
            if (categorizedData[date]) {
                categorizedData[date].push(entry);
            } else {
                categorizedData[date] = [entry];
            }
        });

        return categorizedData;
    };

    const getEntriesForDate = (categorizedData: { [key: string]: any[] }, date: string) => {
        return categorizedData[date] || [];
    };

    const calculateDailySavingAmount = (currentData: Array<any>) => {
        return currentData.reduce((sum, entry) => sum + parseFloat(entry.moneyAdded), 0);
    };

    const getButtonStyle = (data: string): React.CSSProperties => {
        return dataType === data ? styles.activeButton : styles.button;
    };

    const getButtonTextColor = (data: string): React.CSSProperties => {
        return dataType === data ? styles.activeButtonText : styles.buttonText;
    };

    return (
        // <BackgroundWrapper>
        <div style={styles.container}>
            <div style={styles.header}>
                <button onClick={handlePrevious} style={styles.navButton}>{"<"}</button>
                <span style={styles.dateText}>{getDate(dateIndex)}</span>
                <button onClick={handleNext} style={styles.navButton}>{">"}</button>
            </div>

            <div style={styles.content}>
                <div style={styles.board}>
                    <span style={styles.boardLabel}>You saved</span>
                    <span style={styles.amount}>${totalSavingAmount}</span>
                </div>
                <div style={styles.subBoard}>
                  <span style={styles.subBoardLabel}>
                    {dailySavingAmount === 0
                      ? "No savings yet"
                      : `You saved ${dailySavingAmount}`
                    } today
                  </span>
                </div>
                <BackgroundWrapper>
                    <div style={{ ...styles.scrollView, width: '100%' }}>
                        <span style={styles.dateTextForData}>{getDate(dateIndex)}</span>
                        {fetchedData.savingEntries.length > 0 ? (
                            fetchedData.savingEntries.map((entry, index) => {
                                const categoryInfo = categories.find(cat => cat.id === entry.category);
                                if (!categoryInfo) return null;
                                return (
                                    <div key={index} style={{ ...styles.dataContainer }}>
                                        <div style={{ ...styles.data, backgroundColor: categoryInfo.color }}>
                                            <Image src={categoryInfo.iconName} alt={entry.category} width={30} height={30} />
                                            <div style={styles.dataText}>
                                                <span style={styles.dataLabel}>{entry.description ? `${categoryInfo.title}: ${entry.description}` : categoryInfo.title}</span>
                                                <span style={styles.dataAmount}>${entry.moneyAdded}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <span>No data available</span>
                        )}
                    </div>
                </BackgroundWrapper>
            </div>
        </div>
        // </BackgroundWrapper>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: "100%",
        backgroundColor: "#F9F3EE",
        overflow: "hidden",

    } as React.CSSProperties,
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
        backgroundColor: "#FFFFFF", // 纯白色背景
        borderRadius: '8px',
    } as React.CSSProperties,
    navButton: {
        padding: '3px 15px',
        backgroundColor: "#E0BBE4", // 按钮背景色为淡紫色
        color: "#4A4A4A", // 文字颜色为较深的灰色
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    } as React.CSSProperties,
    dateText: {
        fontSize: 15,
        color: "#4A4A4A", // 深灰色
    } as React.CSSProperties,
    mainButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginHorizontal: 20,
    } as React.CSSProperties,
    activeButton: {
        flex: 1,
        backgroundColor: "#F3C5C5", // 活动按钮背景色淡粉色
        padding: '10px 0',
        alignItems: "center",
        borderRadius: 5,
        marginHorizontal: 1,
        color: '#FFFFFF', // 文字为白色
        border: 'none',
    } as React.CSSProperties,
    button: {
        flex: 1,
        backgroundColor: "#E0BBE4", // 按钮背景色为淡紫色
        padding: '10px 0',
        alignItems: "center",
        borderRadius: 5,
        marginHorizontal: 1,
        color: '#4A4A4A', // 深灰色文字
        border: '1px solid #C49DDE', // 边框为深紫色
    } as React.CSSProperties,
    buttonText: {
        color: "#4A4A4A", // 深灰色
        fontSize: 15,
    } as React.CSSProperties,
    activeButtonText: {
        color: "#FFFFFF", // 白色文字
        fontSize: 15,
    } as React.CSSProperties,
    content: {
        flex: 1,
        backgroundColor: "#FFFFFF", // 内容背景为白色
        width: "100%",
        marginTop: 10,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // 防止内容溢出
    } as React.CSSProperties,
    addButton: {
        position: "fixed",
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#F3C5C5", // 添加按钮为淡粉色
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        fontSize: 30,
        color: "#4A4A4A", // 深灰色文字
        border: 'none',
        cursor: 'pointer',
    } as React.CSSProperties,
    board: {
        backgroundColor: "#F3C5C5", // 板块背景为淡粉色
        padding: 5,
        borderRadius: '10px 10px 0 0',
        margin: 10,
        alignItems: "center",
        height: 120,
    } as React.CSSProperties,
    boardLabel: {
        color: "#4A4A4A", // 深灰色文字
        lineHeight: "50px",
    } as React.CSSProperties,
    amount: {
        color: "#4A4A4A", // 深灰色
        lineHeight: "35px",
        fontSize: 30,
        fontWeight: "bold",
    } as React.CSSProperties,
    subBoard: {
        backgroundColor: "#E0BBE4", // 子板块背景色为淡紫色
        padding: 10,
        borderRadius: '0 0 10px 10px',
        marginHorizontal: 10,
        marginTop: 0,
        alignItems: "left",
        height: 40,
    } as React.CSSProperties,
    subBoardLabel: {
        fontSize: 15,
        color: "#4A4A4A", // 深灰色文字
        marginLeft: 10,
        fontWeight: "bold",
    } as React.CSSProperties,
    dataContainer: {
        justifyContent: "flex-start",
        paddingHorizontal: 10,
        width: '100%',
    } as React.CSSProperties,
    dateTextForData: {
        fontSize: 15,
        color: "#4A4A4A", // 深灰色
        margin: 10,
    } as React.CSSProperties,
    data: {
        display: 'flex',
        alignItems: "center",
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        borderRadius: 5,
        height: 50,
        backgroundColor: "#F9F3EE", // 数据条目背景色为米色
    } as React.CSSProperties,
    dataText: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%',
    } as React.CSSProperties,
    dataLabel: {
        color: "#4A4A4A", // 深灰色
        fontSize: 15,
    } as React.CSSProperties,
    dataAmount: {
        color: "#4A4A4A", // 深灰色
        fontSize: 15,
    } as React.CSSProperties,
    scrollView: {
        flex: 1, // 使scrollView占据父容器的剩余空间
        maxHeight: '100%', // 限制scrollView的最大高度
        overflowY: 'auto',
        padding: 10,
        backgroundColor: 'transparent',
    } as React.CSSProperties,
};

export default Detail;
