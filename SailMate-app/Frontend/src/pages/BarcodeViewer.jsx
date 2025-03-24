import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function BarcodeViewer() {
    const { ticketCode } = useParams(); // expects route like /barcode/FTS-20250324-001
    const [barcodeUrl, setBarcodeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ticketCode) return;

        const fetchBarcode = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/barcode/${ticketCode}`);
                if (!res.ok) throw new Error('Barcode not found.');

                const blob = await res.blob();
                setBarcodeUrl(URL.createObjectURL(blob));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBarcode();
    }, [ticketCode]);

    if (loading) return <div className="text-center mt-20 text-gray-600">Loading barcode...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-semibold mb-4">Ferry Ticket Barcode</h1>
                <p className="text-gray-600 mb-4">
                    Ticket Code: <span className="font-mono">{ticketCode}</span>
                </p>
                {barcodeUrl && (
                    <img
                        src={barcodeUrl}
                        alt="Barcode"
                        className="mx-auto border border-gray-300 rounded-md p-2"
                    />
                )}
                <button
                    onClick={() => window.print()}
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    Print Barcode
                </button>
            </div>
        </div>
    );
}

export default BarcodeViewer;
