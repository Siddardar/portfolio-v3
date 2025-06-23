import React from 'react';
import { TrendingUp, Coins, TrendingDown } from 'lucide-react';

const InfoCard = ({ title, value, trend, mainValue, sub1, sub2 }) => {
  const styles = {
    card: {
      marginTop: '20px',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '1px solid #334155',
      maxWidth: '400px',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    
    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.5) 0%, transparent 50%, rgba(15, 23, 42, 0.5) 100%)',
      pointerEvents: 'none',
      borderRadius: '12px'
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '8px',
      position: 'relative',
      zIndex: 1
    },
    
    title: {
      color: '#cbd5e1',
      fontSize: '14px',
      fontWeight: '500',
      margin: 0
    },
    
    percentageBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(16, 185, 129, 0.2)',
      padding: '4px 8px',
      borderRadius: '6px'
    },
    
    percentage: {
      color: '#10b981',
      fontSize: '12px',
      fontWeight: '600'
    },
    
    revenueAmount: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '24px',
      position: 'relative',
      zIndex: 1,
      margin: '0 0 24px 0'
    },
    
    trendingSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#94a3b8',
      marginBottom: '16px',
      position: 'relative',
      zIndex: 1
    },
    
    trendingText: {
      fontSize: '14px',
      fontWeight: '500',
      margin: 0
    },
    
    separator: {
      borderTop: '1px solid #334155',
      margin: '16px 0',
      position: 'relative',
      zIndex: 1
    },
    
    bottomSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      position: 'relative',
      zIndex: 1
    },
    
    bottomText: {
      color: '#94a3b8',
      fontSize: '14px',
      margin: 0
    },
    
    icon: {
      width: '16px',
      height: '16px'
    },
    
    trendIcon: {
      width: '12px',
      height: '12px',
      color: '#10b981'
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardOverlay}></div>
      
      {/* Header Section */}
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        <div style={styles.percentageBadge}>
          {trend === 'up' ? (
            <>
              <TrendingUp style={styles.trendIcon} />
              <span style={styles.percentage}>+{value}%</span>
            </>
          ) : (
            <>
              <TrendingDown style={styles.trendIcon} />
              <span style={styles.percentage}>-{value}%</span>
            </>
          )}
        </div>
      </div>
      
      {/* Revenue Amount */}
      <h1 style={styles.revenueAmount}>{mainValue}</h1>

      {/* Trending Info */}
      <div style={styles.trendingSection}>
        {trend === 'up' ? <TrendingUp style={styles.icon} /> : <TrendingDown style={styles.icon} />}
        <span style={styles.trendingText}>{sub1}</span>
      </div>
      
      {/* Separator Line */}
      <div style={styles.separator}></div>
      
      {/* Bottom Section */}
      <div style={styles.bottomSection}>
        <Coins style={styles.icon} />
        <span style={styles.bottomText}>{sub2}</span>
      </div>
    </div>
  );
};

export default InfoCard;