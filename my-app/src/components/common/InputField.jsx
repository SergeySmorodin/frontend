import React from 'react'

const InputField = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  label,
  placeholder,
  error,
  required = false,
  disabled = false,
  autoComplete
}) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={id}>{label} {required && '*'}</label>}
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={error ? 'error' : ''}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  )
}

export default InputField
