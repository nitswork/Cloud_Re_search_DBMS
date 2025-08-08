import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

// Helper to convert array of { _id: role, count: number } into { role: x, today: y, week: z, total: a }
const transformRoleData = (todayArr, weekArr, totalArr) => {
  const allRoles = new Set([
    ...todayArr.map(i => i._id),
    ...weekArr.map(i => i._id),
    ...totalArr.map(i => i._id),
  ]);

  const roleData = Array.from(allRoles).map(role => {
    const today = todayArr.find(r => r._id === role)?.count || 0;
    const week = weekArr.find(r => r._id === role)?.count || 0;
    const total = totalArr.find(r => r._id === role)?.count || 0;
    return {
      role,
      Today: today,
      Week: week,
      Total: total
    };
  });

  return roleData;
};

const RoleBasedSignUpStats = () => {
  const [roleStats, setRoleStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/signup"); // update if needed
        const transformed = transformRoleData(res.data.todayByRole, res.data.weekByRole, res.data.totalByRole);
        setRoleStats(transformed);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white m-5 p-5 rounded-lg mt-10" style={{ width: "100%", height: 400 }}>
      <h3 className="text-lg font-semibold mb-3">User Signups by Role</h3>
      <ResponsiveContainer>
        <BarChart data={roleStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="role" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Today" fill="#82ca9d" />
          <Bar dataKey="Week" fill="#8884d8" />
          <Bar dataKey="Total" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoleBasedSignUpStats;
