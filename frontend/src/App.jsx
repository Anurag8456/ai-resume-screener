import { useState } from 'react';
import UploadForm from './UploadForm';
import ResultCard from './ResultCard';
import './App.css';

function App() {
    const [result, setResult] = useState(null);

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

                    <UploadForm onResult={setResult} />

                    <p className="trust-line">Built for students job-hunting. 100% free, no signup.</p>
                </div>

                <ResultCard result={result} />
            </div>
        </div>
    );
}

export default App;