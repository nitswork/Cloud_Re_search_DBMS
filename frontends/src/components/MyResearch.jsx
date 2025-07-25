import React, { useEffect, useState } from 'react';
import './MyResearch.css';
import { CiTrash } from 'react-icons/ci';
const MyResearch = ({ user }) => {
    const [myResearches, setMyResearches] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/research/mine', {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            setMyResearches(data);
        })
    }, []);

    const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this research?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/research/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        setMyResearches(prev => prev.filter(r => r._id !== id));
      } else {
        const error = await res.json();
        alert('Error: ' + error.message);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Something went wrong while deleting.');
    }
  };

    return (
        <div className="my-research">
            <h2>My Researches</h2>
            {myResearches.map((r, i) => (
                <div key={i} className="research-item">
                    <h5>{r.title}</h5>
                    {r.text && <p>{r.text}</p>}
                    {r.imageUrl && (
                        <img src={r.imageUrl} alt="Uploaded" />
                    )}
                    <button className="delete-button" onClick={() => handleDelete(r._id)}>
                        <CiTrash className="trash-icon"/>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MyResearch;
