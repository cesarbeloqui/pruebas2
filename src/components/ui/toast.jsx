import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const toastStyles = {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: '1px solid #333',
    borderRadius: '0.5rem',
    padding: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
};

const CloseButton = ({ closeToast }) => (
    <button
        onClick={closeToast}
        className="p-1 hover:bg-gray-800 rounded-full transition-colors"
        style={{ marginLeft: 'auto' }}
    >
        <X size={16} className="text-gray-400" />
    </button>
);

export const customToast = {
    success: (message) =>
        toast.custom((t) => (
            <div style={toastStyles}>
                <span className="text-[#646cff]">✓</span>
                <span>{message}</span>
                <CloseButton closeToast={() => toast.dismiss(t.id)} />
            </div>
        ), {
            position: 'bottom-right',
            duration: 4000,
        }),

    error: (message) =>
        toast.custom((t) => (
            <div style={{ ...toastStyles, borderColor: '#ef4444' }}>
                <span className="text-red-500">✕</span>
                <span>{message}</span>
                <CloseButton closeToast={() => toast.dismiss(t.id)} />
            </div>
        ), {
            position: 'bottom-right',
            duration: 4000,
        }),

    notification: (message) =>
        toast.custom((t) => (
            <div style={toastStyles}>
                <span>🔔</span>
                <span>{message}</span>
                <CloseButton closeToast={() => toast.dismiss(t.id)} />
            </div>
        ), {
            position: 'bottom-right',
            duration: 4000,
        }),
};