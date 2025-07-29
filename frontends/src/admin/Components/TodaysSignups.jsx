import React, { useEffect, useState } from 'react';
import { getToday } from '../../api';
import './TodaysSignups.css';

const TodaysSignups = () => {
  const [signups, setSignups] = useState([]);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const res = await getToday();
        setSignups(res.data);
      } catch (err) {
        console.error('Failed to fetch today\'s signups:', err);
      }
    };

    fetchSignups();
  }, []);

  return (
    <div className="todays-signups-card">
      <h3>Today's Signups</h3>
      <p className="signup-count">{signups.length}</p>
      {signups.length > 0 && (
        <ul className="signup-list">
          {signups.map(user => (
            <li key={user._id}>{user.firstName} {user.lastName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodaysSignups;
