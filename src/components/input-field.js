import React, { useState } from 'react';

const InputField = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = 'text',
  required = false,
  disabled = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const styles = {
    container: {
      position: 'relative',
      margin: '48px 0 24px 0'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '12px 0 2px 0',
      fontSize: '20px',
      color: 'white',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: `2px solid ${isFocused ? 'white' : '#6b7280'}`,
      outline: 'none',
      transition: 'border-color 0.3s ease',
      fontFamily: 'inherit'
    },
    inputDisabled: {
      color: '#6b7280',
      cursor: 'not-allowed'
    },
    label: {
      position: 'absolute',
      left: 0,
      top: isFocused || value ? '-20px' : '12px',
      fontSize: isFocused || value ? '16px' : '20px',
      color: isFocused ? 'white' : '#9ca3af',
      transition: 'all 0.3s ease',
      pointerEvents: 'none',
      transformOrigin: 'left center',
      fontWeight: '500'
    },
    placeholder: {
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
        {label && (
          <label style={styles.label}>
            {label} {required && '*'}
          </label>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={!label ? placeholder : ''}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            ...styles.input,
            ...(disabled ? styles.inputDisabled : {}),
            '::placeholder': styles.placeholder
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default InputField;
