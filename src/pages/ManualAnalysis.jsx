import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // ✅ Added Sidebar Import

const ManualAnalysis = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState({
        education: '',
        skills: '',
        interests: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setCurrentStep((prev) => prev + 1);
    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const handleNewScan = () => {
        setResult(null);
        setFormData({ education: '', skills: '', interests: '' });
        setCurrentStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            // ✅ FIX: Removed 'http://localhost:5000' so it works on mobile via Proxy
            // NEW (Correct for Live Site)
            const response = await fetch('https://placement-sync.onrender.com/api/ai/analyze-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.analysis) {
                try {
                    let parsedData = typeof data.analysis === 'string'
                        ? JSON.parse(data.analysis)
                        : data.analysis;

                    // Double parse safety for some AI responses
                    if (typeof parsedData === 'string') parsedData = JSON.parse(parsedData);

                    setResult(parsedData);
                } catch (e) {
                    console.error("JSON Parse Error", e);
                    setResult({ eligibility: "Error parsing AI response", roadmap: [], suggestions: [] });
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            alert("AI Error. Please check console.");
        } finally {
            setLoading(false);
        }
    };

    const formatText = (text) => {
        if (!text) return "";
        if (typeof text !== 'string') return String(text);
        const cleanText = text.replace(/^[\*\-•]\s*/, '');
        const parts = cleanText.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} style={{ color: '#fff', fontWeight: '700' }}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const toTitleCase = (str) => {
        return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const renderContent = (content) => {
        if (!content) return <p className="text-muted">No data available.</p>;

        if (typeof content === 'string') {
            return <p className="result-text">{formatText(content)}</p>;
        }

        if (Array.isArray(content)) {
            return (
                <div className="list-container">
                    {content.map((item, index) => {
                        const isHeader = typeof item === 'string' && (item.trim().startsWith('**') || /^(Phase|Step)\s+\d+/.test(item.trim()));
                        if (isHeader) {
                            return <h5 key={index} style={{ color: '#06b6d4', marginTop: '15px', marginBottom: '8px', fontSize: '1.1rem' }}>{formatText(item)}</h5>;
                        }
                        if (typeof item === 'object') {
                            const titleKey = ['name', 'skill', 'title', 'step', 'phase', 'role'].find(k => item[k]) || Object.keys(item)[0];
                            const title = item[titleKey];
                            const descKey = ['description', 'details', 'focus', 'content'].find(k => item[k]);
                            const description = descKey ? item[descKey] : "";
                            return (
                                <div key={index} className="list-item-card" style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', marginBottom: '10px', borderLeft: '3px solid #06b6d4' }}>
                                    <strong style={{ color: '#fff', display: 'block', marginBottom: '4px' }}>
                                        {formatText(title)}
                                        {item.type && <span style={{ fontSize: '0.7rem', background: 'rgba(6,182,212,0.2)', color: '#06b6d4', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px' }}>{item.type}</span>}
                                    </strong>
                                    {description && <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>{formatText(description)}</p>}
                                </div>
                            );
                        }
                        if (typeof item === 'string' && item.trim().length <= 1) return null;
                        return (
                            <div key={index} style={{ marginBottom: '8px', paddingLeft: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <span style={{ color: '#06b6d4', lineHeight: '1.6' }}>•</span>
                                <span style={{ color: '#cbd5e1', lineHeight: '1.6' }}>{formatText(item)}</span>
                            </div>
                        );
                    })}
                </div>
            );
        }
        if (typeof content === 'object') {
            return (
                <div className="result-object">
                    {Object.entries(content).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: '20px' }}>
                            <h5 style={{ color: '#06b6d4', textTransform: 'capitalize', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '5px', display: 'inline-block' }}>
                                {toTitleCase(key)}
                            </h5>
                            {renderContent(value)}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const progressWidth = ((currentStep - 1) / 2) * 100;

    return (
        // ✅ 1. Standard Layout Wrapper
        <div className="dashboard-container">

            {/* ✅ 2. Sidebar Component */}
            <Sidebar />

            {/* ✅ 3. Main Content Area */}
            <div className="main-content">
                <div className="bg-glow bg-1"></div>
                <div className="bg-glow bg-2"></div>

                <div className="wizard-main-card">

                    <div className="manual-header">
                        {/* Kept the back button logic, but removed the button itself since Sidebar exists now, 
                OR we can keep it as a 'Reset' button. Let's keep it simple. */}
                        <h2>AI Career Architect</h2>
                        <div className="step-indicator">Step {currentStep} of 3</div>
                    </div>

                    {!result && (
                        <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${progressWidth}%` }}></div>
                        </div>
                    )}

                    {!result && (
                        <form onSubmit={handleSubmit} className="step-form">

                            {/* STEP 1 */}
                            <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
                                <div className="step-icon"><i className="fa-solid fa-graduation-cap"></i></div>
                                <h3>The Foundation</h3>
                                <p>Tell us about your academic journey so far.</p>
                                <textarea
                                    name="education"
                                    className="glass-input"
                                    placeholder="e.g., Matric (Science), FSC Pre-Engineering, BS CS 5th Semester at NUML..."
                                    value={formData.education}
                                    onChange={handleChange}
                                    autoComplete="off"
                                ></textarea>

                                <div className="wiz-nav-buttons">
                                    <button type="button" className="wiz-btn-back" disabled>
                                        <i className="fa-solid fa-arrow-left"></i> Back
                                    </button>
                                    <button type="button" className="wiz-btn-next" onClick={nextStep} disabled={!formData.education}>
                                        Next <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>

                            {/* STEP 2 */}
                            <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
                                <div className="step-icon"><i className="fa-solid fa-code"></i></div>
                                <h3>The Arsenal</h3>
                                <p>What tools, languages, or skills do you already possess?</p>
                                <textarea
                                    name="skills"
                                    className="glass-input"
                                    placeholder="e.g., Python (Basic), C++ (OOP), HTML/CSS, Git..."
                                    value={formData.skills}
                                    onChange={handleChange}
                                    autoComplete="off"
                                ></textarea>

                                <div className="wiz-nav-buttons">
                                    <button type="button" className="wiz-btn-back" onClick={prevStep}>
                                        <i className="fa-solid fa-arrow-left"></i> Back
                                    </button>
                                    <button type="button" className="wiz-btn-next" onClick={nextStep} disabled={!formData.skills}>
                                        Next <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>

                            {/* STEP 3 */}
                            <div className={`form-step ${currentStep === 3 ? 'active' : ''}`}>
                                <div className="step-icon"><i className="fa-solid fa-crosshairs"></i></div>
                                <h3>The Target</h3>
                                <p>What is your dream role? Be as specific as you can.</p>
                                <input
                                    type="text"
                                    name="interests"
                                    className="glass-input single-line"
                                    placeholder="e.g., AI Engineer, MERN Stack Developer..."
                                    value={formData.interests}
                                    onChange={handleChange}
                                    autoComplete="off"
                                />

                                <div className="wiz-nav-buttons">
                                    <button type="button" className="wiz-btn-back" onClick={prevStep}>
                                        <i className="fa-solid fa-arrow-left"></i> Back
                                    </button>
                                    <button type="submit" className="wiz-btn-finish" disabled={loading || !formData.interests}>
                                        {loading ? <><i className="fa-solid fa-spinner fa-spin"></i> Analyzing...</> : 'Launch AI Analysis 🚀'}
                                    </button>
                                </div>
                            </div>

                        </form>
                    )}

                    {result && (
                        <div className="results-container">
                            <div className="results-header">
                                <h3>Analysis Complete</h3>
                                <button onClick={handleNewScan} className="wiz-btn-new">
                                    <i className="fa-solid fa-rotate-right"></i> New Scan
                                </button>
                            </div>

                            {/* The new "Career Architect" Grid Layout */}
                            <div className="manual-grid">

                                {/* LEFT COLUMN */}
                                <div className="left-col">
                                    <div className="glass-card">
                                        <div className="card-header">
                                            <i className="fa-solid fa-check-to-slot" style={{ color: '#4ade80' }}></i>
                                            <h3>Eligibility Check</h3>
                                        </div>
                                        <div className="card-body">{renderContent(result.eligibility)}</div>
                                    </div>

                                    <div className="glass-card">
                                        <div className="card-header">
                                            <i className="fa-solid fa-lightbulb" style={{ color: '#facc15' }}></i>
                                            <h3>Smart Suggestions</h3>
                                        </div>
                                        <div className="card-body">{renderContent(result.suggestions)}</div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="right-col">
                                    <div className="glass-card full-height">
                                        <div className="card-header">
                                            <i className="fa-solid fa-road" style={{ color: 'var(--accent)' }}></i>
                                            <h3>Your Roadmap</h3>
                                        </div>
                                        <div className="card-body">{renderContent(result.roadmap)}</div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManualAnalysis;