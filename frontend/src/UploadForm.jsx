import { useState, useRef } from 'react';
import axios from 'axios';

function UploadForm({ onResult }) {
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (!file) return;
        const validTypes = ['.pdf', '.docx'];
        const isValid = validTypes.some((ext) => file.name.toLowerCase().endsWith(ext));
        if (!isValid) {
            setError('Only .pdf or .docx files are supported.');
            return;
        }
        setError('');
        setResumeFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!resumeFile) {
            setError('No resume detected. Upload a file to begin.');
            return;
        }
        if (!jobDescription.trim()) {
            setError('Paste a job description to run the match.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobDescription', jobDescription);

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/screen', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onResult(response.data);
        } catch (err) {
            console.error(err);
            setError('Scan failed. Confirm the backend is running and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="scan-form">
            <div
                className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${resumeFile ? 'dropzone-filled' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <div className="scan-line" />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => handleFile(e.target.files[0])}
                    hidden
                />
                {resumeFile ? (
                    <>
                        <p className="dropzone-title">FILE LOCKED</p>
                        <p className="dropzone-filename">{resumeFile.name}</p>
                        <p className="dropzone-hint">Click to replace</p>
                    </>
                ) : (
                    <>
                        <p className="dropzone-title">DROP RESUME TO SCAN</p>
                        <p className="dropzone-hint">.PDF or .DOCX — or click to browse</p>
                    </>
                )}
            </div>

            <div className="jd-panel">
                <label htmlFor="jobDescription" className="panel-label">JOB_DESCRIPTION.TXT</label>
                <textarea
                    id="jobDescription"
                    rows={8}
                    placeholder="// paste the target job description here"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                />
            </div>

            {error && <p className="error-text">⚠ {error}</p>}

            <button type="submit" disabled={loading} className="scan-button">
                {loading ? 'ANALYZING…' : 'RUN ANALYSIS'}
            </button>
        </form>
    );
}

export default UploadForm;