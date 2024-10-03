"use client";

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { getDatabase, ref, get } from 'firebase/database'; 


interface AnimationProps {
    uid: string;
}

const Animation: React.FC<AnimationProps> = ({ uid }) => {
    const [targetReached, setTargetReached] = useState(false);
    const [animationPlaying, setAnimationPlaying] = useState(true);

    const handleCloseAnimation = () => {
        setAnimationPlaying(false);
    };

    useEffect(() => {
        const checkGoalStatus = async () => {
            try {
                const database = getDatabase();
                const userGoalRef = ref(database, `users/${uid}/task`);
                const userSavingsRef = ref(database, `addInfo/${uid}`);
                
                const goalSnapshot = await get(userGoalRef);
                const savingsSnapshot = await get(userSavingsRef);
        
                if (goalSnapshot.exists() && savingsSnapshot.exists()) {
                    const goal = goalSnapshot.val().goal;
                    const savingsEntries = savingsSnapshot.val();
                    const totalMoneyAdded = Object.values(savingsEntries).reduce((acc: number, entry: any) => acc + parseInt(entry.moneyAdded), 0);
        
                    if (goal <= totalMoneyAdded) {
                        setTargetReached(true);
                        console.log("Target reached!");
                    }
                }
            } catch (error) {
                console.error("Error fetching goal status from Firebase:", error);
            }
        };

        checkGoalStatus();
    }, [uid]);

    return (
        <>
            {/* The animation */}
            {targetReached && animationPlaying && (
                <div style={styles.animationOverlay} onClick={handleCloseAnimation}>
                    <div style={styles.messageContainer}>
                        <h1 style={styles.congratsText}>You reached your goal!</h1>
                    </div>
                    <video
                        src="/assets/targetReachedAnimation.mp4"
                        autoPlay
                        muted
                        width="100%"
                        height="100%"
                        style={styles.fullscreenAnimation}
                        onEnded={() => setAnimationPlaying(false)} // Reset the animation state when video ends
                    />
                </div>
            )}
        </>
    );
};

const styles = {
    animationOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    } as React.CSSProperties,
    fullscreenAnimation: {
        width: '75vw',
        height: '75vh',
        objectFit: 'contain',
        borderRadius: '10px',
        filter: 'blur(0)', // No blur on animation
    } as React.CSSProperties,
    messageContainer: {
        position: 'absolute',
        top: '10%',
        zIndex: 10001,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        textAlign: 'center',
    } as React.CSSProperties,
    congratsText: {
        fontSize: '3rem',
        color: '#fff',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
    } as React.CSSProperties,
};

export default Animation;
