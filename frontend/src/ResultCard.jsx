function CircularScore({ score }) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.max(0, Math.min(100, score ?? 0));
    const offset = circumference - (pct / 100) * circumference;

    return (
        <svg className="score-ring" width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r={radius} className="score-ring-bg" />
            <circle
                cx="90" cy="90" r={radius}
                className="score-ring-fill"
                style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
            />
            <text x="90" y="82" textAnchor="middle" className="score-ring-value">{Math.round(pct)}%</text>
            <text x="90" y="104" textAnchor="middle" className="score-ring-label">MATCH</text>
        </svg>
    );
}

function RadarChart({ skillsPct, experiencePct, overallPct }) {
    const center = 90;
    const maxR = 70;
    const axes = [
        { label: 'SKILLS', value: skillsPct, angle: -90 },
        { label: 'EXPERIENCE', value: experiencePct, angle: 30 },
        { label: 'OVERALL', value: overallPct, angle: 150 },
    ];

    const toPoint = (angleDeg, value) => {
        const angle = (angleDeg * Math.PI) / 180;
        const r = (value / 100) * maxR;
        return [center + r * Math.cos(angle), center + r * Math.sin(angle)];
    };

    const outerPoint = (angleDeg) => {
        const angle = (angleDeg * Math.PI) / 180;
        return [center + maxR * Math.cos(angle), center + maxR * Math.sin(angle)];
    };

    const dataPoints = axes.map((a) => toPoint(a.angle, a.value).join(',')).join(' ');

    return (
        <svg className="radar-chart" width="180" height="180" viewBox="0 0 180 180">
            {[0.33, 0.66, 1].map((f, i) => (
                <polygon
                    key={i}
                    points={axes.map((a) => {
                        const [ox, oy] = outerPoint(a.angle);
                        return `${center + (ox - center) * f},${center + (oy - center) * f}`;
                    }).join(' ')}
                    className="radar-grid"
                />
            ))}
            <polygon points={dataPoints} className="radar-fill" />
            {axes.map((a, i) => {
                const [lx, ly] = outerPoint(a.angle);
                return <text key={i} x={lx} y={ly} textAnchor="middle" className="radar-label">{a.label}</text>;
            })}
        </svg>
    );
}

function ResultCard({ result }) {
    if (!result) return null;

    const matching = result.matchingSkills || [];
    const missing = result.missingSkills || [];
    const skillsPct = matching.length + missing.length > 0
        ? (matching.length / (matching.length + missing.length)) * 100
        : 0;
    const experiencePct = result.experienceMet ? 100 : 35;
    const overallPct = result.score ?? 0;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <span className="panel-label">MATCH_ANALYSIS.LOG</span>
                <h2>{result.candidateName || 'CANDIDATE_UNKNOWN'}</h2>
            </div>

            <div className="dashboard-charts">
                <CircularScore score={overallPct} />
                <RadarChart skillsPct={skillsPct} experiencePct={experiencePct} overallPct={overallPct} />
            </div>

            <div className="skills-section">
                <span className="panel-label">MATCHING_SKILLS</span>
                <div className="chip-list">
                    {matching.map((skill, i) => <span key={i} className="chip chip-cyan">{skill}</span>)}
                </div>
            </div>

            <div className="skills-section">
                <span className="panel-label">MISSING_SKILLS</span>
                <div className="chip-list">
                    {missing.map((skill, i) => <span key={i} className="chip chip-purple">{skill}</span>)}
                </div>
            </div>

            <div className="verdict-panel">
                <span className="panel-label">VERDICT</span>
                <p>{result.verdict}</p>
            </div>
        </div>
    );
}

export default ResultCard;