import React, { useState } from 'react';

interface MarketButtonProps {
    marketMode: boolean;
    toggleMarketMode: () => void;
    installedPlugins: string[];
    togglePlugin: (pluginId: string) => void;
}

const plugins = [
    {
        id: 'piechart',
        name: 'Pie Chart',
        description: 'Show savings in a pie chart.',
        detail: 'Displays category-wise breakdown using colorful slices.'
    },
    {
        id: 'linechart',
        name: 'Line Chart',
        description: 'Monthly savings line chart.',
        detail: 'Shows trends over months with a smooth line.'
    },
    {
        id: 'savinglist',
        name: 'Saving List',
        description: 'List of recent savings.',
        detail: 'Presents the saved entries in time sequence.'
    },
    {
        id: 'savingranking',
        name: 'Saving Ranking',
        description: 'Top saving categories.',
        detail: 'Highlights your most saved categories with medal colors.'
    },
];

const MarketButton: React.FC<MarketButtonProps> = ({
    marketMode,
    toggleMarketMode,
    installedPlugins,
    togglePlugin
}) => {
    const [activePluginId, setActivePluginId] = useState<string | null>(null);

    return (
        <>
            {/* Market Button */}
            <button
                onClick={toggleMarketMode}
                style={{
                    position: 'fixed',
                    top: '200px',
                    right: '180px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: marketMode ? '#00b4f5' : '#f0f0f0',
                    color: marketMode ? 'white' : 'black',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                }}
            >
                {marketMode ? 'Done' : 'Market'}
            </button>

            {/* Market Modal */}
            {marketMode && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button style={styles.closeButton} onClick={toggleMarketMode}>×</button>
                        <h2>Plugin Market</h2>
                        {plugins.map(plugin => {
                            const isActive = activePluginId === plugin.id;
                            const isInstalled = installedPlugins.includes(plugin.id);

                            return (
                                <div
                                    key={plugin.id}
                                    style={{
                                        ...styles.pluginCard,
                                        backgroundColor: isActive ? '#f9f9f9' : 'white'
                                    }}
                                >
                                    <div
                                        onClick={() =>
                                            setActivePluginId(isActive ? null : plugin.id)
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <h3>{plugin.name}</h3>
                                        <p>{plugin.description}</p>
                                    </div>

                                    {/* Install/Uninstall button always visible */}
                                    <div style={styles.buttonRow}>
                                        <button
                                            style={{
                                                ...styles.installButton,
                                                backgroundColor: isInstalled ? '#f44336' : '#00b4f5',
                                            }}
                                            onClick={() => togglePlugin(plugin.id)}
                                        >
                                            {isInstalled ? 'Uninstall' : 'Install'}
                                        </button>
                                    </div>

                                    {/* Expandable details */}
                                    <div style={isActive ? styles.expandedDetail : styles.collapsedDetail}>
                                        <p>{plugin.detail}</p>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000
    },
    modal: {
        width: '600px',
        maxHeight: '80vh',
        backgroundColor: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 0 20px rgba(0,0,0,0.2)',
        position: 'relative',
        overflowY: 'auto',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        fontSize: '18px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
    },
    pluginCard: {
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '16px 20px',
        marginBottom: '14px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
    },
    buttonRow: {
        marginTop: '10px',
    },
    installButton: {
        padding: '8px 16px',
        borderRadius: '6px',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease'
    },
    detailSection: {
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid #ddd',
        fontStyle: 'italic',
        color: '#555'
    },
    collapsedDetail: {
        maxHeight: 0,
        overflow: 'hidden',
        transition: 'max-height 0.5s ease',
    },
    expandedDetail: {
        maxHeight: '300px',
        overflow: 'hidden',
        transition: 'max-height 0.5s ease',
        paddingTop: '10px',
        borderTop: '1px solid #ddd',
        fontStyle: 'italic',
        color: '#555',
    },
    
};

export default MarketButton;
