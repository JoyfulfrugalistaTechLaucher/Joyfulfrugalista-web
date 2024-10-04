"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Detail from "../detail/page";
import AddPage from "../addPage/page";
import PieChartComponent from '../components/pieChart';

const LedgerPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [refreshDetail, setRefreshDetail] = useState(false); // 用于控制 Detail 刷新
    const [showPieChart, setShowPieChart] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const togglePieChart = () => {
        setShowPieChart(!showPieChart);
    };


    const closeModalAndRefresh = () => {
        setShowModal(false);
        setRefreshDetail(!refreshDetail); // 触发 Detail 组件的刷新
    };

    const closeModalOnClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (event.target === event.currentTarget) {
            closeModalAndRefresh();
        }
    };

    const closePieChart = () => {
        setShowPieChart(false);
    };

    return (
        <div style={styles.container}>
            {/* 背景图片 */}
            <div style={styles.backgroundContainer}>
                <Image
                    src="/assets/ledgerPage.jpg"
                    alt="Ledger Page Background"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
            </div>

            {/* Detail 组件 */}
            <div style={styles.detailContainer}>
                <Detail key={refreshDetail ? 'refresh' : 'static'} />
            </div>

            {/* Add Entry 按钮 */}
            <div style={styles.addButtonContainer}>
                <button style={styles.addButton} onClick={toggleModal}>
                    +
                </button>
            </div>

            {/* Pie Chart Diagram 按钮*/}
            <div style={styles.pieChartButtonContainer}>
                <button style={styles.pieChartButton} onClick={togglePieChart}>
                    Monthly Pie Chart
                </button>
            </div>

            {/* Modal 弹窗 */}
            {showModal && (
                <div style={styles.modalOverlay} onClick={closeModalOnClickOutside}>
                    <div style={styles.modalContent}>
                        <AddPage />
                        <button style={styles.closeButton} onClick={closeModalAndRefresh}>
                            Close
                        </button>
                    </div>
                </div>
            )}
            {/* Pie Chart Diagram Button */}
            <div style={styles.pieChartButtonContainer}>
                <button style={styles.pieChartButton} onClick={togglePieChart}>
                    Monthly Pie Chart
                </button>
            </div>
            {/* Pie Chart Display */}
            {showPieChart && <PieChartComponent onClose={closePieChart} />}

            {/* Existing Modal code omitted for brevity */}

        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
    } as React.CSSProperties,
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1, // 确保背景图片在最底层
    } as React.CSSProperties,
    detailContainer: {
        position: 'absolute',
        top: '25%',
        left: '14%', // 左边距
        width: '30%',
        height: '60%',
        zIndex: 2, // 确保 Detail 组件在图片上方
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 半透明背景色
        padding: '0px', // 内边距
        borderRadius: '10px',
        overflow: 'hidden', // 防止内容溢出
        display: 'flex',
        flexDirection: 'column',
    } as React.CSSProperties,
    pieChartButtonContainer: {
        position: 'absolute',
        bottom: '16%', // 距离底部16%
        left: '30%',
        zIndex: 3, // 确保按钮显示在最上层
    } as React.CSSProperties,
    addButtonContainer: {
        position: 'absolute',
        bottom: '16%', // 距离底部16%
        left: '15%',
        zIndex: 3, // 确保按钮显示在最上层
    } as React.CSSProperties,
    pieChartButton: {
        padding: '10px 20px',
        backgroundColor: '#E0BBE4',
        color: 'white',
        border: 'none',
        borderRadius: '300px',
        cursor: 'pointer',
    } as React.CSSProperties,
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#E0BBE4',
        color: 'white',
        border: 'none',
        borderRadius: '300px',
        cursor: 'pointer',
    } as React.CSSProperties,
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明黑色背景
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4, // 确保在最顶层显示
    } as React.CSSProperties,
    modalContent: {
        width: '35%',
        backgroundColor: 'transparent',
        padding: '20px',
        height: '70%',
        borderRadius: '10px',
    } as React.CSSProperties,
    closeButton: {
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        alignSelf: 'flex-end',
    } as React.CSSProperties,



};

export default LedgerPage;
