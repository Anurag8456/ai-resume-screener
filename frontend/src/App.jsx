import { useState } from 'react';
import UploadForm from './UploadForm';
import ResultCard from './ResultCard';
import './App.css';

function App() {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <div className="app-shell">
            <header className="site-header">
                <div className="logo">Resume<span>Screener</span></div>
                <div className="header-pill">Powered by Gemini AI</div>
            </header>

            <div className="hero">
                <div className="hero-copy">
                    <p className="eyebrow">SCORE MY RESUME — FREE AI JOB MATCH</p>
                    <h1>How well do you match this job?</h1>
                    <p className="hero-subtitle">
                        Upload your resume and paste the job description. Our AI compares them
                        against real hiring criteria and shows you exactly what's missing.
                    </p>

                    <UploadForm
                        onResult={setResult}
                        onStart={() => setLoading(true)}
                        onEnd={() => setLoading(false)}
                    />

                    <p className="trust-line">Built for students job-hunting. 100% free, no signup.</p>
                </div>

                {loading && !result && <SkeletonResultCard />}
                {!loading && result && <ResultCard result={result} />}
            </div>
        </div>
    );
}

function SkeletonResultCard() {
    return (
        <div className="preview-panel">
            <div className="preview-chrome">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
                <span className="preview-tab">MATCH REPORT</span>
            </div>

            <div className="preview-body">
                <div className="preview-top">
                    <div className="skeleton-ring"></div>
                    <div className="preview-summary">
                        <h3 className="skeleton-title"></h3>
                        <p className="skeleton-text" style={{ width: '60%' }}></p>
                    </div>
                </div>

                <div className="scale-bar-wrap">
                    <div className="scale-bar">
                        <div className="scale-marker" style={{ width: '50%' }}></div>
                    </div>
                </div>

                <div className="category-list">
                    <div className="category-row">
                        <div className="category-top">
                            <span className="field-label">Skills Match</span>
                            <span className="skeleton-text" style={{ width: '40%' }}></span>
                        </div>
                        <div className="category-track">
                            <div className="category-fill" style={{ width: '50%' }}></div>
                        </div>
                    </div>
                    <div className="category-row">
                        <div className="category-top">
                            <span className="field-label">Experience Alignment</span>
                            <span className="skeleton-text" style={{ width: '40%' }}></span>
                        </div>
                        <div className="category-track">
                            <div className="category-fill" style={{ width: '50%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="skills-section">
                    <span className="field-label">Matching skills</span>
                    <div className="chip-list">
                        <div className="skeleton-chip" />
                        <div className="skeleton-chip" style={{ marginLeft: '8px' }} />
                        <div className="skeleton-chip" style={{ marginLeft: '8px' }} />
                    </div>
                </div>

                <div className="skills-section">
                    <span className="field-label">Missing skills</span>
                    <div className="chip-list">
                        <div className="skeleton-chip" />
                        <div className="skeleton-chip" style={{ marginLeft: '8px' }} />
                        <div className="skeleton-chip" style={{ marginLeft: '8px' }} />
                    </div>
                </div>

                <div className="verdict-box">
                    <span className="field-label">Verdict</span>
                    <p className="skeleton-text" style={{ width: '70%' }}></p>
                </div>
            </div>
        </div>
    );
}

export default App;