import React , { useState, useEffect } from 'react';
import './MainDashboard.css';
import { FaSearch, FaPen } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const MainDashboard = () => {
    const [allResearch, setAllResearch] = useState([]);
    const [uploadData, setUploadData] = useState({ title: '', text: '', file: null });
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/research/public')
        .then(res => res.json())
        .then(data => setAllResearch(data))
        .catch(err=>{
            console.error("Error fetching public research:",err);
        });
    }, []);
    const filteredResearch = [...allResearch]
        .filter(r =>
            r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.text && r.text.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            const aMatch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || (a.text && a.text.toLowerCase().includes(searchTerm.toLowerCase()));
            const bMatch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) || (b.text && b.text.toLowerCase().includes(searchTerm.toLowerCase()));
            return bMatch - aMatch; // true > false
        });
    // const handleUpload = async () => {
    //     const formData = new FormData();
    //     formData.append('title', uploadData.title);
    //     formData.append('text', uploadData.text);
    //     formData.append('file', uploadData.file);

    //     const res = await fetch('http://localhost:3001/upload', {
    //     method: 'POST',
    //     body: formData,
    //     credentials: 'include'
    //     });
    //     if (res.ok) {
    //         const newUpload = await res.json();
    //         setAllResearch(prev => [newUpload, ...prev]);
    //         setUploadData({ title: '', text: '', file: null });
    //     } else {
    //         alert('Upload failed');
    //     }
    // };

    return (
        <div className="main-dashboard">
            <div className="header">
                <h2>Dashboard</h2>
                <div className="search-bar">
                    <FaSearch className="icon" />
                    <input type="text" placeholder="Search"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className='write-container'>
                <button className="write-button"onClick={() => navigate('/write')}>
                <FaPen className='pen-icon'/> <span>Write</span>
                </button>
            </div>
            <div className="research-feed">
                <h4>All Researches</h4>
                {filteredResearch.map((r, i) => (
                <div key={i} className="research-item">
                    <h5>{r.title}</h5>
                    {r.text && <p>{r.text.split('\n')[0].slice(0, 100)}...</p>}
                    {r.imageUrl && <img src={r.imageUrl} alt="Uploaded" />}
                    <small>By {r.authorName || 'Unknown'}</small>
                </div>))}
            </div>
        </div>
    );
};

export default MainDashboard;