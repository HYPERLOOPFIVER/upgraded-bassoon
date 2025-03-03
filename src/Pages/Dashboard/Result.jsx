import React, { useState } from 'react';

const Result = () => {
    const [folio, setFolio] = useState('');
    const [resultUrl, setResultUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct the URL for the result page
        const url = `https://birlavidyamandir.com/SchoolExamResult1.asp?FolioNo=${folio}`;
        setResultUrl(url);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Check Your Result</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <label htmlFor="folio">Enter Folio Number: </label>
                <input
                    type="text"
                    id="folio"
                    value={folio}
                    onChange={(e) => setFolio(e.target.value)}
                    placeholder="Folio Number"
                    required
                    style={{ padding: '8px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Fetch Result
                </button>
            </form>

            {resultUrl && (
                <div style={{ width: '100%', height: '500px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                    <iframe
                        src={resultUrl}
                        title="Student Result"
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Result;