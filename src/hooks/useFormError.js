import { useState } from 'react';

export function useFormError() {
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const clearErrors = () => {
        setError('');
        setFieldErrors({});
    };

    const handleError = (error, field = null) => {
        if (field) {
            setFieldErrors(prev => ({ ...prev, [field]: error }));
        } else {
            setError(error);
        }
    };

    return {
        error,
        fieldErrors,
        handleError,
        clearErrors
    };
}