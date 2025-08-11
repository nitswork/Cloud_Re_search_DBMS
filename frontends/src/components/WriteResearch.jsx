import React, { useState } from 'react';
import './WriteResearch.css';
import { CiFileOn, CiVideoOn, CiImageOn } from "react-icons/ci";
import { BsFileEarmarkCode } from "react-icons/bs";
import { baseURL } from '../api';

const Write = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [visibility, setVisibility] = useState('public');
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const handleUpload = async () => {
    if (!title.trim() && !text.trim()) {
      alert('Please enter at least a title or some text.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('text', text.trim());
    formData.append('visibility', visibility);
    if (file) {
      formData.append('file', file);
    }

    try {
      setLoading(true);
      setUploadedUrl(null);

      const res = await fetch(`${baseURL}/upload-research`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        alert('Upload successful!');
        setTitle('');
        setText('');
        setFile(null);
        setVisibility('public');

        if (data.imageUrl) {
          // Full URL banate hain backend ka baseURL + image path
          setUploadedUrl(`${baseURL}${data.imageUrl}`);
        }
      } else {
        alert(data.message || 'Upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setLoading(false);
      alert('Server error');
    }
  };

  return (
    <div className="write-wrapper">
      <div className='write-content'>
        <label className="write-label">NEW CONTENT</label>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="write-input"
      />

      <textarea
        placeholder="Write your research details..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="write-textarea"
      />

      <div className="write-icon-buttons">
        <label className="circle-btn" title="Choose a file">
          <CiFileOn />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <label className="circle-btn" title="Choose a video">
          <CiVideoOn />
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <label className="circle-btn" title="Choose an image">
          <CiImageOn />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <label className="circle-btn" title="Choose a code file">
          <BsFileEarmarkCode />
          <input type="file" accept=".js,.py,.java,.cpp,.ts" onChange={(e) => setFile(e.target.files[0])} />
        </label>
      </div>

      {file && (
        <p style={{ marginTop: '8px', fontSize: '14px' }}>
          Selected file: <b>{file.name}</b>
        </p>
      )}

      <div className="write-visibility-toggle">
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="public">Publish</option>
          <option value="private">Private</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        className="write-upload-btn"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload Research'}
      </button>

      {uploadedUrl && (
        <p style={{ marginTop: '10px' }}>
          File Link: <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">{uploadedUrl}</a>
        </p>
      )}
    </div>
  );
};

export default Write;
