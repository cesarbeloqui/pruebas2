import { useParams, useNavigate } from 'react-router-dom';
import { useEmailVerification } from '../../../hooks/useEmailVerification';
import { VerificationStatus } from './VerificationStatus';

export default function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { status, error } = useEmailVerification(token);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#242424] px-4">
            <div className="w-full max-w-md">
                <div className="bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-gray-800">
                    <div className="text-center">
                        <VerificationStatus
                            status={status}
                            error={error}
                            onNavigateToLogin={() => navigate('/login')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}