import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const UploadCV = () => {
    const [file, setFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // --- DRAG & DROP HANDLERS ---
    const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const handleDragLeave = () => { setDragging(false); };
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile?.type === 'application/pdf') {
            setFile(droppedFile);
            setResult(null);
        } else {
            alert("Please upload a PDF file only.");
        }
    };
    const handleFileSelect = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
        }
    };

    // --- UPLOAD LOGIC ---
    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            // Fake delay to show off the animation
            await new Promise(resolve => setTimeout(resolve, 2000));

            // ✅ FIX: Removed 'http://localhost:5000' to fix "AI Error" on mobile
            // New (Correct for Live Site)
            const response = await fetch('https://placement-sync.onrender.com/api/ai/upload-resume', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.analysis) {
                setResult(typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Scan Failed.");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = (content) => {
        if (!content) return <p className="text-muted">No data available.</p>;
        if (typeof content === 'string') return <p>{content}</p>;
        if (Array.isArray(content)) {
            return (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {content.map((item, index) => (
                        <li key={index} style={{ marginBottom: '8px', color: '#cbd5e1', display: 'flex', gap: '8px' }}>
                            <span style={{ color: 'var(--accent)' }}>•</span> {item}
                        </li>
                    ))}
                </ul>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-container">
            <Sidebar />

            <div className="main-content">

                {/* HEADER */}
                {!result && (
                    <div className="top-header">
                        <div className="header-text">
                            <h1>AI Resume Architect <i className="fa-solid fa-compass-drafting" style={{ color: 'var(--accent)' }}></i></h1>
                            <p>Upload your CV to generate your roadmap.</p>
                        </div>
                    </div>
                )}

                {/* SCANNER */}
                {!result && (
                    <div className="scanner-wrapper">
                        <div
                            className={`scanner-box ${dragging ? 'dragging' : ''} ${loading ? 'scanning' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {/* Laser Line Animation */}
                            {loading && <div className="scan-line"></div>}

                            <div className="scanner-content">
                                {!file ? (
                                    <>
                                        <div className="icon-glow"><i className="fa-solid fa-cloud-arrow-up"></i></div>

                                        <div>
                                            <h3>Drag & Drop PDF Resume</h3>
                                            <p style={{ margin: 0, opacity: 0.7 }}>or select file from computer</p>
                                        </div>

                                        <input type="file" accept=".pdf" onChange={handleFileSelect} id="fileInput" hidden />
                                        <label htmlFor="fileInput" className="btn-browse">Browse Files</label>
                                    </>
                                ) : (
                                    <>
                                        <div className="file-preview">
                                            <i className="fa-solid fa-file-pdf"></i>
                                            <div><h4>{file.name}</h4><span>{(file.size / 1024).toFixed(2)} KB</span></div>
                                            {!loading && <button onClick={() => setFile(null)} className="btn-remove"><i className="fa-solid fa-xmark"></i></button>}
                                        </div>

                                        {/* ✅ FIXED: Button matches Manual Page Style & Text */}
                                        <button onClick={handleUpload} className="btn-scan" disabled={loading}>
                                            {loading ? (
                                                <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</>
                                            ) : (
                                                'Launch AI Analysis 🚀'
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* RESULTS */}
                {result && (
                    <div className="results-animate">
                        <div className="results-header">
                            <h3>Analysis Complete</h3>
                            <button onClick={() => { setFile(null); setResult(null); }} className="wiz-btn-new">
                                <i className="fa-solid fa-rotate-right"></i> New Scan
                            </button>
                        </div>

                        <div className="manual-grid">
                            <div className="left-col">
                                <div className="glass-card">
                                    <div className="card-header"><i className="fa-solid fa-clipboard-check" style={{ color: '#4ade80' }}></i><h3>Eligibility Check</h3></div>
                                    <div className="card-content">
                                        <div className="status-row">
                                            <span className="label">Status</span>
                                            <span className="value highlight">{result.eligibility?.status || "Yes"}</span>
                                        </div>
                                        <div className="roles-section">
                                            <span className="label">Best Fit Roles</span>
                                            <ul>{result.eligibility?.roles?.map((role, i) => (<li key={i}><i className="fa-solid fa-caret-right"></i> {role}</li>))}</ul>
                                        </div>
                                        <div className="reason-box"><span className="label">Reason</span><p>{result.eligibility?.reason}</p></div>
                                    </div>
                                </div>

                                <div className="glass-card">
                                    <div className="card-header"><i className="fa-regular fa-lightbulb" style={{ color: '#facc15' }}></i><h3>Smart Suggestions</h3></div>
                                    <div className="card-content">
                                        <div className="suggestion-group"><span className="sub-title">Certifications</span>{renderContent(result.suggestions?.certifications)}</div>
                                        <div className="suggestion-group mt-3"><span className="sub-title" style={{ color: 'var(--accent)' }}>Technical Skills</span>{renderContent(result.suggestions?.technicalSkills)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="right-col">
                                <div className="glass-card full-height">
                                    <div className="card-header"><i className="fa-solid fa-road" style={{ color: 'var(--accent)' }}></i><h3>Your Roadmap</h3></div>
                                    <div className="roadmap-container">
                                        {result.roadmap?.map((step, index) => (
                                            <div key={index} className="roadmap-step">
                                                <div className="step-number">{index + 1}</div>
                                                <div className="step-content"><p>{step}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default UploadCV;