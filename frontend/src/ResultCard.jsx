function ScoreRing({ score, hasResult }) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const pct = hasResult ? Math.max(0, Math.min(100, score ?? 0)) : 0;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <svg width="140" height="140" viewBox="0 0 140 140" className="score-ring-svg">
            <circle cx="70" cy="70" r={radius} className="ring-bg" />
            <circle
                cx="70" cy="70" r={radius}
                className="ring-fill"
                style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
            />
            <text x="70" y="64" textAnchor="middle" className="ring-value">
                {hasResult ? Math.round(pct) : '--'}
            </text>
            <text x="70" y="86" textAnchor="middle" className="ring-total">out of 100</text>
        </svg>
    );
}

function ScaleBar({ score, hasResult }) {
    const pct = hasResult ? Math.max(0, Math.min(100, score ?? 0)) : 0;
    return (
        <div className="scale-bar-wrap">
            <div className="scale-bar">
                <div className="scale-marker" style={{ left: `${pct}%` }} />
            </div>
            <div className="scale-labels">
                <span>0</span>
                <span>{hasResult ? 'YOUR SCORE' : 'AWAITING RESUME'}</span>
                <span>100</span>
            </div>
        </div>
    );
}

function CategoryBar({ label, value, hasResult }) {
    return (
        <div className="category-row">
            <div className="category-top">
                <span>{label}</span>
                <span>{hasResult ? `${Math.round(value)}/100` : '—'}</span>
            </div>
            <div className="category-track">
                <div className="category-fill" style={{ width: hasResult ? `${value}%` : '0%' }} />
            </div>
        </div>
    );
}

function ResultCard({ result }) {
    const hasResult = !!result;
    const matching = result?.matchingSkills || [];
    const missing = result?.missingSkills || [];
    const skillsPct = matching.length + missing.length > 0
        ? (matching.length / (matching.length + missing.length)) * 100
        : 0;
    const experiencePct = result?.experienceMet ? 100 : 35;
    const overallPct = result?.score ?? 0;

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
                    <ScoreRing score={overallPct} hasResult={hasResult} />
                    <div className="preview-summary">
                        <h3>{hasResult ? (result.candidateName || 'Your Match Score') : 'Your match score'}</h3>
                        <p>
                            {hasResult
                                ? 'Here is how your resume stacks up against this role.'
                                : 'Upload a resume and job description to see your real score here.'}
                        </p>
                    </div>
                </div>

                <ScaleBar score={overallPct} hasResult={hasResult} />

                <div className="category-list">
                    <CategoryBar label="Skills Match" value={skillsPct} hasResult={hasResult} />
                    <CategoryBar label="Experience Alignment" value={experiencePct} hasResult={hasResult} />
                </div>

                {hasResult && (
                    <div className="result-content">
                        <div className="skills-section">
                            <span className="field-label">Matching skills</span>
                            <div className="chip-list">
                                {matching.map((skill, i) => <span key={i} className="chip chip-green">{skill}</span>)}
                            </div>
                        </div>

                        <div className="skills-section">
                            <span className="field-label">Missing skills</span>
                            <div className="chip-list">
                                {missing.map((skill, i) => <span key={i} className="chip chip-red">{skill}</span>)}
                            </div>
                        </div>

                        <div className="verdict-box">
                            <span className="field-label">Verdict</span>
                            <p>{result.verdict}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ResultCard;