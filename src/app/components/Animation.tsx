"use client";
import React, { useState, useEffect } from 'react';

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
                const response = await fetch(`/api/savings/${uid}`);

                if (!response.ok) {
                    console.error('Error fetching goal status from API:', response.status);
                    return;
                }

                const data = await response.json();

                const { goal, totalMoneyAdded } = data;

                if (goal <= totalMoneyAdded) {
                    setTargetReached(true);
                    console.log("Target reached!");
                }
                console.log("Total: " + totalMoneyAdded + "Goal: " + goal);
            } catch (error) {
                console.error("Error fetching goal status from API:", error);
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
