import { useState, useEffect } from 'react';
import { verifyEmailToken } from '../services/api/verification.service';
import { customToast } from '../components/ui/toast';

export const useEmailVerification = (token) => {
    const [status, setStatus] = useState('verifying');
    const [error, setError] = useState(null);
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setError('Token no proporcionado');
                return;
            }

            const result = await verifyEmailToken(token);

            if (result.success) {
                setStatus('success');
                setIsAlreadyVerified(result.alreadyVerified);
                customToast.success(result.message);
            } else {
                setStatus('error');
                setError(result.error);
                customToast.error(result.error);
            }
        };

        verifyEmail();
    }, [token]);

    return { status, error, isAlreadyVerified };
};