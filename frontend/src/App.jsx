import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Activity, Shield, Upload, FileText, ArrowRight, User } from 'lucide-react';
import './index.css';

// Axios Defaults
const API_URL = 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="glass-header">
          <div className="logo">
            <Shield className="icon-pulse" />
            <span>MedChain AI</span>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Login() {
  const [email, setEmail] = useState('patient@medchain.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try seeding the DB?');
    }
  };

  return (
    <div className="login-container slide-in">
      <div className="login-card glass-panel">
        <h2>Welcome Back</h2>
        <p className="subtitle">Secure Blockchain Medical Records</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="primary-btn">
            Login <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard() {
  const [file, setFile] = useState(null);
  const [aiData, setAiData] = useState({ bp: 120, sugar: 110, heartRate: 75 });
  const [prediction, setPrediction] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    
    // Append required fields from schema
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      formData.append('userId', user._id);
    }
    formData.append('doctorName', 'Dr. Smith');
    formData.append('notes', 'Uploaded from Dashboard');

    try {
      const res = await axios.post('/records/upload-record', formData);
      setMessage(`File uploaded successfully: ${res.data.fileUrl || 'Success'}`);
    } catch (err) {
      setMessage(`Upload failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/ai/ai-predict', aiData);
      setPrediction(res.data);
    } catch (err) {
      alert('AI prediction failed. Ensure AI server is running on port 8000.');
    }
  };

  return (
    <div className="dashboard-container fade-in">
      <div className="grid">
        {/* Upload Panel */}
        <div className="glass-panel">
          <h3><Upload size={20} /> Upload Medical Record</h3>
          <form onSubmit={handleUpload}>
            <input type="file" onChange={e => setFile(e.target.files[0])} className="file-input" />
            <button type="submit" className="secondary-btn mt-4">Upload File</button>
          </form>
          {message && <p className="success-text mt-4">{message}</p>}
        </div>

        {/* AI Health Risk Predictor */}
        <div className="glass-panel">
          <h3><Activity size={20} /> AI Health Predictor</h3>
          <form onSubmit={handlePredict} className="ai-form">
            <div className="input-group">
              <label>Blood Pressure (Systolic)</label>
              <input type="number" value={aiData.bp} onChange={e => setAiData({...aiData, bp: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Blood Sugar (mg/dL)</label>
              <input type="number" value={aiData.sugar} onChange={e => setAiData({...aiData, sugar: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Heart Rate (BPM)</label>
              <input type="number" value={aiData.heartRate} onChange={e => setAiData({...aiData, heartRate: e.target.value})} />
            </div>
            <button type="submit" className="primary-btn mt-4">Analyze Risk</button>
          </form>

          {prediction && (
            <div className="prediction-result fade-in mt-4">
              <div className={`risk-badge ${prediction.risk?.toLowerCase()}`}>
                Risk Level: {prediction.risk || 'Unknown'}
              </div>
              <p><strong>Confidence:</strong> {prediction.confidence}</p>
              <ul>
                {prediction.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
