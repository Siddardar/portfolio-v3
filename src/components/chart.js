import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ReturnsChart = ({ strategyData = [], benchmarkData = [] }) => {

  const fmt2 = (n) =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const [timeFrame, setTimeFrame] = useState('1Y');
  
  const timeFrames = {
    '3M': { months: 3, label: '3M', tickInterval: 0 },
    '6M': { months: 6, label: '6M', tickInterval: 1 },
    '1Y': { months: 12, label: '1Y', tickInterval: 2 },
    '2Y': { months: 24, label: '2Y', tickInterval: 4 },
    '5Y': { months: 60, label: '5Y', tickInterval: 12 },
    '10Y': { months: 120, label: '10Y', tickInterval: 24 },
    '30Y': { months: 360, label: '30Y', tickInterval: 60 }
  };
  
  // Filter data based on timeFrame and merge both datasets
  const chartData = useMemo(() => {
    console.log('Processing data for timeframe:', timeFrame);
    console.log('Strategy data length:', strategyData.length);
    console.log('ETFs/Your Fund data length:', benchmarkData.length);
    
    if (!strategyData.length && !benchmarkData.length) {
      return [];
    }
    
    const currentTimeFrame = timeFrames[timeFrame];
    
    // Find the start date from the data (first date in either array)
    let startDate = null;
    if (strategyData.length > 0) {
      startDate = strategyData[0].date instanceof Date ? 
        new Date(strategyData[0].date.getTime()) : 
        new Date(strategyData[0].date);
    } else if (benchmarkData.length > 0) {
      startDate = benchmarkData[0].date instanceof Date ? 
        new Date(benchmarkData[0].date.getTime()) : 
        new Date(benchmarkData[0].date);
    }
    
    if (!startDate) {
      return [];
    }
    
    // Calculate cutoff date as start date + timeframe
    const cutoffDate = new Date(startDate);
    cutoffDate.setMonth(cutoffDate.getMonth() + currentTimeFrame.months);
    
    console.log('Start date:', startDate);
    console.log('Cutoff date (start + timeframe):', cutoffDate);
    
    // Process and format the data arrays
    const processData = (data, datasetName) => {
      console.log(`Processing ${datasetName} data:`, data.slice(0, 2)); // Log first 2 items
      
      return data.map((item, index) => {
        // Handle both Date objects and date strings
        let date;
        if (item.date instanceof Date) {
          date = new Date(item.date.getTime()); // Create new Date to avoid mutation
        } else {
          date = new Date(item.date);
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          console.error(`Invalid date at index ${index}:`, item.date);
          return null;
        }
        
        let displayDate;
        if (currentTimeFrame.months > 12) {
          displayDate = date.toLocaleDateString('en-US', { 
            month: 'short',
            year: '2-digit'
          });
        } else {
          displayDate = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
          });
        }
        
        return {
          date: date.toISOString().split('T')[0],
          dateObj: date,
          fullDate: date.toLocaleDateString('en-US', { 
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          displayDate: displayDate,
          netNominalTotal: Number(item.netNominalTotal),
          total_invested: Number(item.totalPremiumPaid)
        };
      }).filter(item => item !== null); // Remove invalid dates
    };
    
    // Process both datasets
    const processedStrategy = processData(strategyData, 'strategy');
    const processedBenchmark = processData(benchmarkData, 'benchmark');
    
    console.log('Processed strategy length:', processedStrategy.length);
    console.log('Processed benchmark length:', processedBenchmark.length);
    
    // Filter data based on timeframe: show data from start date up to cutoff date
    const filteredStrategy = processedStrategy.filter(item => {
      const isWithinRange = item.dateObj >= startDate && item.dateObj <= cutoffDate;
      return isWithinRange;
    });
    
    const filteredBenchmark = processedBenchmark.filter(item => {
      const isWithinRange = item.dateObj >= startDate && item.dateObj <= cutoffDate;
      return isWithinRange;
    });
    
    console.log('Filtered strategy length:', filteredStrategy.length);
    console.log('Filtered benchmark length:', filteredBenchmark.length);
    
    if (filteredStrategy.length > 0) {
      console.log('First filtered strategy date:', filteredStrategy[0].dateObj);
      console.log('Last filtered strategy date:', filteredStrategy[filteredStrategy.length - 1].dateObj);
    }
    
    // Create a merged dataset with all unique dates
    const dateMap = new Map();
    
    // Add strategy data
    filteredStrategy.forEach((item) => {
      dateMap.set(item.date, {
        date: item.date,
        dateObj: item.dateObj,
        fullDate: item.fullDate,
        displayDate: item.displayDate,
        strategy: item.netNominalTotal,
        invested: item.total_invested
      });
    });
    
    // Add benchmark data
    filteredBenchmark.forEach((item) => {
      const existing = dateMap.get(item.date);
      if (existing) {
        existing.benchmark = item.netNominalTotal;
      } else {
        dateMap.set(item.date, {
          date: item.date,
          dateObj: item.dateObj,
          fullDate: item.fullDate,
          displayDate: item.displayDate,
          benchmark: item.netNominalTotal,
          invested: item.total_invested
        });
      }
    });
    
    // Convert to array and sort by date using Date objects
    const result = Array.from(dateMap.values())
      .sort((a, b) => a.dateObj - b.dateObj);
    
    console.log('Final chart data length:', result.length);
    
    return result;
  }, [timeFrame, strategyData, benchmarkData]);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#1f2937',
          border: '1px solid #4b5563',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
            {payload[0]?.payload?.fullDate || label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: entry.color
              }} />
              <span style={{ color: 'white', fontSize: '14px' }}>
                {entry.name === 'strategy' ? 'Investment Linked Policy' : 
                 entry.name === 'benchmark' ? 'ETFs/Your Fund' : 'Total Invested'}: 
                <span style={{
                  marginLeft: '4px',
                  fontWeight: '600',
                  color: entry.name === 'invested' ? '#fbbf24' : 
                        entry.value >= (payload[0]?.payload?.invested || 0) ? '#10b981' : '#ef4444'
                }}>
                  ${entry.value?.toLocaleString()}
                </span>
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Calculate performance metrics
  const latestData = chartData[chartData.length - 1];
  const totalInvested = latestData?.invested || 0;
  const strategyValue = latestData?.strategy || 0;
  const benchmarkValue = latestData?.benchmark || 0;
  const strategyGain = strategyValue - totalInvested;
  const benchmarkGain = benchmarkValue - totalInvested;
  const outperformance = strategyValue - benchmarkValue;
  
  const containerStyle = {
    color: 'white',
    margin: '48px 0 0 0',
    borderRadius: '8px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };
  
  const headerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px'
  };
  
  const metricsStyle = {
    display: 'flex',
    gap: '24px',
    fontSize: '14px',
    flexWrap: 'wrap'
  };
  
  const metricStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  };
  
  const buttonGroupStyle = {
    display: 'flex',
    gap: '2px',
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '4px',
    alignSelf: 'flex-start'
  };
  
  const buttonStyle = (isActive) => ({
    padding: '6px 12px',
    fontSize: '14px',
    fontWeight: '500',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: isActive ? '#2563eb' : 'transparent',
    color: isActive ? 'white' : '#9ca3af'
  });
  
  const chartContainerStyle = {
    height: '400px',
    width: '100%',
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    padding: '8px'
  };
  
  const legendStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginTop: '16px',
    fontSize: '14px'
  };
  
  const legendItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  // Responsive design
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (isSmallScreen) {
    headerStyle.flexDirection = 'column';
    headerStyle.alignItems = 'flex-start';
    metricsStyle.flexDirection = 'column';
    metricsStyle.gap = '8px';
  } else {
    headerStyle.flexDirection = 'row';
    headerStyle.justifyContent = 'space-between';
    headerStyle.alignItems = 'flex-start';
  }
  
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <div style={metricsStyle}>
            <div style={metricStyle}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>Investment Linked Policy</span>
              <span style={{
                fontWeight: '600',
                color: strategyGain >= 0 ? '#10b981' : '#ef4444'
              }}>
                ${fmt2(strategyValue)} ({strategyGain >= 0 ? '+' : ''}${fmt2(strategyGain)})
              </span>
            </div>
            <div style={metricStyle}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>ETFs/Your Fund</span>
              <span style={{
                fontWeight: '600',
                color: benchmarkGain >= 0 ? '#10b981' : '#ef4444'
              }}>
                ${fmt2(benchmarkValue)} ({benchmarkGain >= 0 ? '+' : ''}${fmt2(benchmarkGain)})
              </span>
            </div>
            <div style={metricStyle}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>Outperformance</span>
              <span style={{
                fontWeight: '600',
                color: outperformance >= 0 ? '#10b981' : '#ef4444'
              }}>
                {outperformance >= 0 ? '+' : ''}${fmt2(outperformance)}
              </span>
            </div>
            <div style={metricStyle}>
              <span style={{ color: '#9ca3af', fontSize: '12px' }}>Total Invested</span>
              <span style={{ fontWeight: '600', color: '#fbbf24' }}>
                ${fmt2(totalInvested)}
              </span>
            </div>
          </div>
        </div>
        
        <div style={buttonGroupStyle}>
          {Object.entries(timeFrames).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setTimeFrame(key)}
              style={buttonStyle(timeFrame === key)}
              onMouseEnter={(e) => {
                if (timeFrame !== key) {
                  e.target.style.backgroundColor = '#374151';
                  e.target.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (timeFrame !== key) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#9ca3af';
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      
      <div style={chartContainerStyle}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="displayDate"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={timeFrames[timeFrame].tickInterval}
              minTickGap={20}
            />
            <YAxis 
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="strategy"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#1e40af' }}
              name="strategy"
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#6b7280"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, stroke: '#6b7280', strokeWidth: 2, fill: '#4b5563' }}
              name="benchmark"
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="invested"
              stroke="#fbbf24"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#fbbf24', strokeWidth: 2, fill: '#f59e0b' }}
              name="invested"
              strokeDasharray="2 2"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div style={legendStyle}>
        <div style={legendItemStyle}>
          <div style={{ width: '16px', height: '2px', backgroundColor: '#3b82f6' }}></div>
          <span style={{ color: '#d1d5db' }}>Investment Linked Policy</span>
        </div>
        <div style={legendItemStyle}>
          <div style={{ 
            width: '16px', 
            height: '2px', 
            backgroundColor: '#6b7280',
            backgroundImage: 'repeating-linear-gradient(to right, #6b7280 0, #6b7280 3px, transparent 3px, transparent 6px)'
          }}></div>
          <span style={{ color: '#d1d5db' }}>ETFs/Your Fund</span>
        </div>
        <div style={legendItemStyle}>
          <div style={{ 
            width: '16px', 
            height: '2px', 
            backgroundColor: '#fbbf24',
            backgroundImage: 'repeating-linear-gradient(to right, #fbbf24 0, #fbbf24 2px, transparent 2px, transparent 4px)'
          }}></div>
          <span style={{ color: '#d1d5db' }}>Total Invested</span>
        </div>
      </div>
    </div>
  );
};

export default ReturnsChart;