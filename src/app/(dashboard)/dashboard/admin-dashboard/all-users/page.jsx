"use client";
import React, { useEffect, useState } from "react";
import { Trash2, ShieldCheck } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const handleRoleChange = (id, newRole) => {
    fetch(`http://localhost:5000/api/admin/update-role/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    }).then(() => window.location.reload());
  };

  const handleDelete = (id) => {
    if(confirm("Are you sure?")) {
        fetch(`http://localhost:5000/api/admin/delete-user/${id}`, { method: 'DELETE' })
        .then(() => setUsers(users.filter(u => u._id !== id)));
    }
  };

  return (
    <div className="bg-[#090514]/80 border border-white/10 p-6 rounded-3xl mt-8">
      <h3 className="text-xl font-bold text-white mb-6">User Management</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-white/10">
            <th className="pb-4">Name</th>
            <th className="pb-4">Email</th>
            <th className="pb-4">Role</th>
            <th className="pb-4">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white">
          {users.map(user => (
            <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
              <td className="py-4">{user.name}</td>
              <td className="py-4">{user.email}</td>
              <td className="py-4">
                <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="bg-[#030014] border border-white/10 rounded px-2 py-1"
                >
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="py-4">
                <button onClick={() => handleDelete(user._id)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;