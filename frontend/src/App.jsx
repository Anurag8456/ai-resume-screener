import { useState } from 'react';
import UploadForm from './UploadForm';
import ResultCard from './ResultCard';
import './App.css';

function App() {
    const [result, setResult] = useState(null);

    return (
        <div className="app-shell">
            <div className="glow-blob glow-cyan" />
            <div className="glow-blob glow-purple" />

            <div className="app-container">
                <header>
                    <p className="eyebrow">AI-POWERED CANDIDATE ANALYSIS</p>
                    <h1>RESUME<span className="accent">://</span>SCREENER</h1>
                    <p className="subtitle">Drop a resume. Paste the role. Get an instant match report.</p>
                </header>

                <UploadForm onResult={setResult} />
                <ResultCard result={result} />
            </div>
        </div>
    );
}

export default App;