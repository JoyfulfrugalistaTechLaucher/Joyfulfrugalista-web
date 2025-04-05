"use client";
import React, { useState,useEffect } from 'react';
import Image from 'next/image';
import Detail from "../detail/page";
import AddPage from "../addPage/page";
import PieChartComponent from '../components/pieChart';
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebaseConfig";
import { signOut } from "firebase/auth";
import MainLayout from "../layouts/MainLayout";
import BackgroundWrapper from "../components/BackgroundWrapper";
import { SummaryBox } from './components/SummaryBox';
import {
  Avatar,
  Box,
  Container,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

function LedgerCalendar() {
  return (
    // TODO:
    // 1. make this a controlled component
    // 2. make the background darker and add border
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar />
    </LocalizationProvider>
  );
}



function LedgerPage() {
  const [showModal, setShowModal] = useState(false);
  const [refreshDetail, setRefreshDetail] = useState(false); // 用于控制 Detail 刷新
  const [showPieChart, setShowPieChart] = useState(false);
  const router = useRouter();
  const { uid, isLoggedIn, setUid } = useAuth();
  const [loading, setLoading] = useState(true);
  // detail of user's savings
  const [savingEntries, setSavingEntries] = useState<SavingsRecord[]>([]);
  const [totalSavingAmount, setTotalSavingAmount] = useState<number>(0);
  const [dailySavingAmount, setDailySavingAmount] = useState<number>(0);

  useEffect(() => {
    console.log("uid" + uid);

    if (!isLoggedIn) {
      setLoading(false);

      router.replace("/login");
    } else if (uid) {
      console.log("succeed");
      setLoading(false);
    }
  }, [isLoggedIn, uid, router]);

  if (loading) {
    return (
      <BackgroundWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <CircularProgress />
        </Box>
      </BackgroundWrapper>
    );
  }

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const togglePieChart = () => {
    setShowPieChart(!showPieChart);
  };


  const closeModalAndRefresh = () => {
    setShowModal(false);
    setRefreshDetail(!refreshDetail);
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
    <MainLayout>
      {/* Three columns: Calender, Detail, Category (Add panel) */}
      <Stack spacing={4} direction='row'>
        <LedgerCalendar />

      </Stack>

      <div style={styles.container}>

        {/* Detail */}
        <div style={styles.detailContainer}>
          <Detail key={refreshDetail ? 'refresh' : 'static'} />
        </div>

        {/* Add Entry */}
        <div style={styles.addButtonContainer}>
          <button style={styles.addButton} onClick={toggleModal}>
            +
          </button>
        </div>

        {/* Pie Chart Diagram */}
        <div style={styles.pieChartButtonContainer}>
          <button style={styles.pieChartButton} onClick={togglePieChart}>
            Monthly Pie Chart
          </button>
        </div>

        {/* Modal */}
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
    </MainLayout>
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
    left: '14%',
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
