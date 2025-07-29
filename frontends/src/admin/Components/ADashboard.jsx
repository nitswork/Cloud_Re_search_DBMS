import React, { useState, useEffect } from 'react';
import './ADashboard.css';
import { fetchAllUsers, fetchAllPublications } from '../../api';

const ADashboard = () => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPublications, setTotalPublications] = useState(0);
    const [todaysSignups, setTodaysSignups] = useState(0);

    useEffect(() => {
    const fetchStats = async () => {
        try {
        const usersRes = await fetchAllUsers();
        const publicationsRes = await fetchAllPublications();

        const today = new Date().toISOString().split('T')[0];
        const todaySignups = usersRes.data.filter(user =>
            user.createdAt?.startsWith(today)
        ).length;

        setTotalUsers(usersRes.data.length);
        setTotalPublications(publicationsRes.data.length);
        setTodaysSignups(todaySignups);
        } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        }
    };

    fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">
        <h2 className="admin-dashboard-heading">Admin Dashboard</h2>

        <div className="admin-dashboard-cards">
            <div className="admin-dashboard-card">
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
            </div>
            <div className="admin-dashboard-card">
            <h3>Today's Signups</h3>
            <p>{todaysSignups}</p>
            </div>
            <div className="admin-dashboard-card">
            <h3>Total Publications</h3>
            <p>{totalPublications}</p>
            </div>
        </div>
        </div>
    );
};

export default ADashboard;
