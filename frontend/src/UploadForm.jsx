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
            setError('Upload a resume to get started.');
            return;
        }
        if (!jobDescription.trim()) {
            setError('Paste a job description so we can compare it.');
            return;
        }

        const formData = new FormData();
        formData.append('resume', resumeFile);
        formData.append('jobDescription', jobDescription);

        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/screen`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onResult(response.data);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Confirm the backend is running and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="upload-card">
            <div
                className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${resumeFile ? 'dropzone-filled' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
            >
                <div className="badge-privacy">🔒 100% private</div>
                <div className="upload-icon">📄</div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => handleFile(e.target.files[0])}
                    hidden
                />
                {resumeFile ? (
                    <>
                        <p className="dropzone-title">{resumeFile.name}</p>
                        <p className="dropzone-hint">Click to choose a different file</p>
                    </>
                ) : (
                    <>
                        <p className="dropzone-title">Drop your resume here or <span>choose a file</span></p>
                        <p className="dropzone-hint">PDF or DOCX only. Max 5MB.</p>
                    </>
                )}
            </div>

            <label htmlFor="jobDescription" className="field-label">Job description</label>
            <textarea
                id="jobDescription"
                rows={6}
                placeholder="Paste the job description you're applying to..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
            />

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading} className="primary-button">
                {loading ? 'Analyzing your resume…' : 'Check my match score'}
            </button>
        </form>
    );
}

export default UploadForm;