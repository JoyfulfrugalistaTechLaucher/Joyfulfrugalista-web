'use client';
import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useRecords } from '@/app/contexts/RecordsContext';
import MainLayout from '@/app/layouts/MainLayout';
import BackgroundWrapper from '@/app/components/BackgroundWrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import {
    Box,
    CircularProgress,
} from "@mui/material";
import MarketButton from "@/app/dashboard/components/marketButton";
import EditButton from "@/app/dashboard/components/editButton";
import PieChartComponent from "@/app/dashboard/components/pieChart";
import LineChartComponent from "@/app/dashboard/components/lineChart";
import SavingList from "@/app/dashboard/components/savingList";
import SavingRanking from "@/app/dashboard/components/savingRanking";



const DashboardPage: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [refreshDetail, setRefreshDetail] = useState(false);
    const [showPieChart, setShowPieChart] = useState(false);
    const [showLineChart, setShowLineChart] = useState(false);
    const [showSavingList, setShowSavingList] = useState(false);
    const [showSavingRanking, setshowSavingRanking] = useState(false);



    const router = useRouter();
    const { uid, isLoggedIn, setUid } = useAuth();
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = () => setEditMode(prev => !prev);
    const [marketMode, setMarketMode] = useState(false);
    const toggleMarketMode = () => setMarketMode(prev => !prev);

    const [installedPlugins, setInstalledPlugins] = useState<string[]>([
        'piechart', 'linechart'
    ]);

    const togglePlugin = (pluginId: string) => {
        setInstalledPlugins(prev =>
            prev.includes(pluginId)
                ? prev.filter(id => id !== pluginId)
                : [...prev, pluginId]
        );
    };
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




    const closeModalAndRefresh = () => {
        setShowModal(false);
        setRefreshDetail(!refreshDetail);
    };

    /*    const closeModalOnClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (event.target === event.currentTarget) {
                closeModalAndRefresh();
            }
        };*/

    const togglePieChart = () => {
        setShowPieChart(!showPieChart);
    };

    return (
        <MainLayout>
            <div style={styles.container}>
                {installedPlugins.includes('piechart') && (
                    <PieChartComponent editMode={editMode} onClose={() => togglePlugin('piechart')} />
                )}
                {installedPlugins.includes('linechart') && (
                    <LineChartComponent editMode={editMode} onClose={() => togglePlugin('linechart')} />
                )}
                {installedPlugins.includes('savinglist') && (
                    <SavingList editMode={editMode} onClose={() => togglePlugin('savinglist')} />
                )}
                {installedPlugins.includes('savingranking') && (
                    <SavingRanking editMode={editMode} onClose={() => togglePlugin('savingranking')} />
                )}
                <EditButton editMode={editMode} toggleEditMode={toggleEditMode} />
                <MarketButton
                    marketMode={marketMode}
                    toggleMarketMode={toggleMarketMode}
                    installedPlugins={installedPlugins}
                    togglePlugin={togglePlugin}
                />

            </div>
        </MainLayout>
    );

};

const styles = {
    container: {
        position: 'relative',
        width: '100vw',
        minHeight: '1200px',
    } as React.CSSProperties,
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    } as React.CSSProperties,
    detailContainer: {
        position: 'absolute',
        top: '25%',
        left: '14%',
        width: '30%',
        height: '60%',
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '0px',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    } as React.CSSProperties,
    pieChartButtonContainer: {
        position: 'absolute',
        bottom: '16%',
        left: '30%',
        zIndex: 3,
    } as React.CSSProperties,
    addButtonContainer: {
        position: 'absolute',
        bottom: '16%',
        left: '15%',
        zIndex: 3,
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 4,
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


export default DashboardPage;