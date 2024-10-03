import React, { useState, useEffect } from 'react';

interface AnimationProps {
    uid: string;
}

const Animation: React.FC<AnimationProps> = ({ uid }) => {
    const [targetReached, setTargetReached] = useState(false);

    useEffect(() => {
        const checkGoalStatus = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/savings/${uid}`); // Fetch request
                const data = await response.json(); // Get the dataset
                const { goal, totalMoneyAdded } = data; // Get the target money & current savings

                if (goal <= totalMoneyAdded) {
                    setTargetReached(true);
                    console.log("targetReached");
                }
            } catch (error) {
                console.error("Error fetching goal status:", error);
            }
        };

        checkGoalStatus();
    }, [uid]);

    return (
        <>
            {/* The animation */}
            { targetReached && (
                <div style={styles.animationOverlay}>
                    <video
                        src="/assets/targetReachedAnimation.mp4"
                        autoPlay
                        muted
                        width="100%"
                        height="100%"
                        style={styles.fullscreenAnimation}
                        onEnded={() => setTargetReached(false)} // Reset the target state
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
};

export default Animation;
