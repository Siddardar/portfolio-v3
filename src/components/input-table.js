import React, { useState } from 'react';
import { X } from 'lucide-react';

const FundsInputTable = ({ faData, setFaData, yourFundData, setYourFundData, buttonSubmit }) => {
  const [activeTab, setActiveTab] = useState('ILP Fund');

  const tabs = ['ILP Fund', 'ETFs/Your Fund'];
  const currentData = activeTab === 'ILP Fund' ? faData : yourFundData;
  const setCurrentData = activeTab === 'ILP Fund' ? setFaData : setYourFundData;

  const handleInputChange = (id, field, value) => {
    setCurrentData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addRow = () => {
    const newId = Math.max(...currentData.map(item => item.id)) + 1;
    const newRow = {
      id: newId,
      name: 'New Asset',
      allocation: '0',
      fees: '0',
      annualReturn: '0'
    };
    setCurrentData(prev => [...prev, newRow]);
  };

  const deleteRow = (id) => {
    setCurrentData(prev => prev.filter(item => item.id !== id));
  };

  const styles = {
    container: {
      width: '100%',
      marginTop: '24px'
    },
    wrapper: {
      width: '100%',
      margin: '0 auto'
    },
    tabContainer: {
      marginBottom: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    tabWrapper: {
      display: 'flex',
      gap: '4px',
      backgroundColor: '#1f2937',
      padding: '4px'
    },
    tab: {
      padding: '8px 24px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none',
      backgroundColor: 'transparent'
    },
    tabActive: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    tabInactive: {
      color: '#9ca3af'
    },
    submitButton: {
      padding: '8px 24px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      border: 'none',
      backgroundColor: '#2563eb',
      color: 'white',
      marginBottom: '24px',
      width: '100%'
    },
    tableContainer: {
      backgroundColor: '#1f2937',
      border: '1px solid #374151'
    },
    tableWrapper: {
      overflowX: 'auto',
      overflowY: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    thead: {
      backgroundColor: '#374151',
      borderBottom: '1px solid #4b5563'
    },
    th: {
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '500',
      color: '#d1d5db',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderRight: '1px solid #4b5563'
    },
    thFixed: {
      position: 'sticky',
      zIndex: 10,
      backgroundColor: '#111827',
      padding: '12px 16px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '500',
      color: '#d1d5db',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderRight: '1px solid #4b5563'
    },
    thIndex: {
      left: 0,
      width: '64px', // Increased to eliminate gap
      minWidth: '64px'
    },
    thName: {
      left: '64px', // Match the increased index column width
      width: '140px',
      minWidth: '140px'
    },
    thRegular: {
      minWidth: '100px', // Reduced from 128px for mobile
      width: '100px'
    },
    thDelete: {
      width: '64px',
      minWidth: '64px'
    },
    tbody: {
      backgroundColor: '#1f2937'
    },
    tr: {
      borderBottom: '1px solid #374151'
    },
    trHover: {
      backgroundColor: '#374151'
    },
    td: {
      padding: '12px 16px',
      fontSize: '14px',
      borderRight: '1px solid #374151'
    },
    tdFixed: {
      position: 'sticky',
      zIndex: 10,
      backgroundColor: '#111827',
      padding: '12px 16px',
      fontSize: '14px',
      borderRight: '1px solid #374151'
    },
    tdIndex: {
      left: 0,
      color: '#9ca3af',
      width: '64px', // Increased to match header
      minWidth: '64px'
    },
    tdName: {
      left: '64px', // Match the increased width
      width: '140px',
      minWidth: '140px'
    },
    input: {
      width: '100%',
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '14px',
      color: 'white',
      outline: 'none',
      padding: '4px 8px',
      boxSizing: 'border-box' // Ensure padding doesn't cause overflow
    },
    inputFocus: {
      backgroundColor: '#374151'
    },
    deleteButton: {
      color: '#f87171',
      cursor: 'pointer',
      transition: 'color 0.2s',
      backgroundColor: 'transparent',
      border: 'none',
      padding: '4px'
    },
    deleteButtonHover: {
      color: '#fca5a5'
    },
    addButton: {
      width: '100%',
      backgroundColor: '#059669',
      color: 'white',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background-color 0.2s',
      borderTop: '1px solid #374151',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer',
      border: 'none',
      whiteSpace: 'nowrap',
      flexWrap: 'nowrap'
    },
    addButtonHover: {
      backgroundColor: '#047857'
    },
    // Mobile responsive styles
    '@media (max-width: 768px)': {
      thIndex: {
        width: '56px', // Increased for mobile
        minWidth: '56px'
      },
      thName: {
        left: '56px', // Match mobile index width
        width: '120px',
        minWidth: '120px'
      },
      tdIndex: {
        width: '56px',
        minWidth: '56px'
      },
      tdName: {
        left: '56px',
        width: '120px',
        minWidth: '120px'
      },
      thRegular: {
        minWidth: '80px',
        width: '80px'
      }
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.submitButton} onClick={buttonSubmit}>
        <span>Submit</span>
      </button>
      <div style={styles.wrapper}>
        {/* Tab Switcher */}
        <div style={styles.tabContainer}>
          <div style={styles.tabWrapper}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab ? styles.tabActive : styles.tabInactive)
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab) {
                    e.target.style.color = 'white';
                    e.target.style.backgroundColor = '#374151';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab) {
                    e.target.style.color = '#9ca3af';
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table Container */}
        <div style={styles.tableContainer}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={{...styles.thFixed, ...styles.thIndex}}>
                    #
                  </th>
                  <th style={{...styles.thFixed, ...styles.thName}}>
                    Name
                  </th>
                  <th style={{...styles.th, ...styles.thRegular}}>
                    Allocation
                  </th>
                  <th style={{...styles.th, ...styles.thRegular}}>
                    Fees
                  </th>
                  <th style={{...styles.th, ...styles.thRegular}}>
                    Return
                  </th>
                  <th style={{...styles.th, ...styles.thDelete}}>
                    Del
                  </th>
                </tr>
              </thead>
              <tbody style={styles.tbody}>
                {currentData && currentData.map((crypto, index) => (
                  <tr 
                    key={crypto.id} 
                    style={styles.tr}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#374151';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Fixed Index Column */}
                    <td style={{...styles.tdFixed, ...styles.tdIndex}}>
                      {index + 1}
                    </td>
                    
                    {/* Fixed Name Column */}
                    <td style={{...styles.tdFixed, ...styles.tdName}}>
                      <input
                        type="text"
                        value={crypto.name}
                        onChange={(e) => handleInputChange(crypto.id, 'name', e.target.value)}
                        style={styles.input}
                        onFocus={(e) => e.target.style.backgroundColor = '#374151'}
                        onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
                      />
                    </td>
                    
                    {/* Allocation Input */}
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={crypto.allocation}
                        onChange={(e) => handleInputChange(crypto.id, 'allocation', e.target.value)}
                        style={styles.input}
                        onFocus={(e) => e.target.style.backgroundColor = '#374151'}
                        onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
                      />
                    </td>
                    
                    {/* Fees Input */}
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={crypto.fees}
                        onChange={(e) => handleInputChange(crypto.id, 'fees', e.target.value)}
                        style={styles.input}
                        onFocus={(e) => e.target.style.backgroundColor = '#374151'}
                        onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
                      />
                    </td>
                    
                    {/* Annual Return Input */}
                    <td style={styles.td}>
                      <input
                        type="text"
                        value={crypto.annualReturn}
                        onChange={(e) => handleInputChange(crypto.id, 'annualReturn', e.target.value)}
                        style={styles.input}
                        onFocus={(e) => e.target.style.backgroundColor = '#374151'}
                        onBlur={(e) => e.target.style.backgroundColor = 'transparent'}
                      />
                    </td>

                    {/* Delete Button */}
                    <td style={styles.td}>
                      <button
                        onClick={() => deleteRow(crypto.id)}
                        style={styles.deleteButton}
                        title="Delete row"
                        onMouseEnter={(e) => e.target.style.color = '#fca5a5'}
                        onMouseLeave={(e) => e.target.style.color = '#f87171'}
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Add Row Button */}
          <button
            onClick={addRow}
            style={styles.addButton}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#047857'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#059669'}
          >
            <span>Add Row</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundsInputTable;