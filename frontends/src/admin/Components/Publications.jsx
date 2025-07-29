import React, { useEffect, useState } from 'react';
import './Publications.css';
import { CiTrash } from "react-icons/ci";
import { fetchAllPublications, deletePublicationById } from '../../api';

const Publications = () => {
    const [publications, setPublications] = useState([]);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const res = await fetchAllPublications();
                setPublications(res.data);
            } catch (err) {
                console.error('Failed to fetch publications:', err);
            }
        };
        fetchPublications();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this publication?")) return;
        try {
            await deletePublicationById(id);
            setPublications(prev => prev.filter(pub => pub._id !== id));
        } catch (err) {
            console.error('Error deleting publication:', err);
            alert('Failed to delete publication.');
        }
    };

    return (
        <div className="publications-container">
            <h2>All Publications</h2>
            <div className="publication-list">
                {publications.length ? (
                    publications.map(pub => (
                        <div key={pub._id} className="publication-card">
                            <p><strong>Title: </strong>{pub.title || 'Untitled'}</p>
                            <p><strong>Author: </strong> {pub.user?.name || pub.authorName || 'Unknown'}</p>
                            <p><strong>Date: </strong> {new Date(pub.createdAt).toLocaleDateString()}</p>
                            <p className="pub-text-preview"><strong>Sub-Text:</strong>{pub.text || 'No content'}</p>
                            <div className="publication-header">
                                <button className="publication-delete-button" onClick={() => handleDelete(pub._id)}>
                                    <CiTrash className="publication-trash-icon" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-publications">No publications found.</p>
                )}
            </div>
        </div>
    );
};

export default Publications;
