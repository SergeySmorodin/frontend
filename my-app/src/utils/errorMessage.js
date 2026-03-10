const getErrorMessage = (error, defaultMsg) => {
    return error.userMessage || 
           error.response?.data?.detail || 
           error.response?.data?.non_field_errors?.[0] || 
           (typeof error.response?.data === 'string' ? error.response.data : null) ||
           Object.entries(error.response?.data || {})
             .map(([field, messages]) => 
               `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
             ).join('\n') || 
           defaultMsg
  }

export default getErrorMessage

  