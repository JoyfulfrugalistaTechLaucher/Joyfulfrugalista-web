import React from 'react';

interface MarketButtonProps {
    marketMode: boolean;
    toggleMarketMode: () => void;
    installedPlugins: string[];
    togglePlugin: (pluginId: string) => void;
}

const plugins = [
    { id: 'piechart', name: 'Pie Chart', description: 'Show savings in a pie chart.' },
    { id: 'linechart', name: 'Line Chart', description: 'Monthly savings line chart.' },
    { id: 'savinglist', name: 'Saving List', description: 'List of recent savings.' },
    { id: 'savingranking', name: 'Saving Ranking', description: 'Top saving categories.' },
];

const MarketButton: React.FC<MarketButtonProps> = ({
                                                       marketMode,
                                                       toggleMarketMode,
                                                       installedPlugins,
                                                       togglePlugin
                                                   }) => {
    return (
        <>
            <button
                onClick={toggleMarketMode}
                style={{
                    position: 'fixed',
                    top: '180px',
                    right: '200px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    borderRadius: '8px',
                    backgroundColor: marketMode ? '#00b4f5' : '#f0f0f0',
                    color: marketMode ? 'white' : 'black',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                {marketMode ? 'Done' : 'Market'}
            </button>

            {marketMode && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <button style={styles.closeButton} onClick={toggleMarketMode}>×</button>
                        <h2>Plugin Market</h2>
                        {plugins.map(plugin => (
                            <div key={plugin.id} style={styles.pluginCard}>
                                <h3>{plugin.name}</h3>
                                <p>{plugin.description}</p>
                                <button
                                    style={{
                                        ...styles.installButton,
                                        backgroundColor: installedPlugins.includes(plugin.id)
                                            ? '#f44336'
                                            : '#00b4f5'
                                    }}
                                    onClick={() => togglePlugin(plugin.id)}
                                >
                                    {installedPlugins.includes(plugin.id) ? 'Uninstall' : 'Install'}
                                </button>
                            </div>
                        ))}
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
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '10px',
    },
    installButton: {
        marginTop: '10px',
        padding: '6px 12px',
        borderRadius: '6px',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
    }
};

export default MarketButton;
