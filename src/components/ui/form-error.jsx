export function FormError({ error }) {
    if (!error) return null;

    return (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
        </div>
    );
}

export function FieldError({ error }) {
    if (!error) return null;

    return (
        <p className="mt-1 text-sm text-red-500">{error}</p>
    );
}