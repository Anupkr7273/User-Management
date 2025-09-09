import { useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../config";

export default function Dashboard({ token, logout, currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/users`, {
        headers: { 
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to load users");
      }
      
      const data = await res.json();
      const usersWithId = data.map(user => ({
        ...user,
        id: user._id 
      }));
      
      setUsers(usersWithId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!currentUser) return;
    
    if (currentUser.role === "admin") {
      fetchUsers();
    } else {
      setUsers([currentUser]);
      setLoading(false);
    }
  }, [currentUser, fetchUsers]);

  const handleEdit = (user) => {
    setEditUser({...user, id: user._id || user.id});
    setShowPasswordForm(false);
    setSuccessMessage("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUser),
      });
      
      if (!res.ok) throw new Error("Update didn't work");
      
      const data = await res.json();
      setUsers(users.map((u) => (u.id === data.id ? data : u)));
      setEditUser(null);
      setSuccessMessage("Changes saved!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match");
      setProcessing(false);
      return;
    }
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editUser.name,
          email: editUser.email,
          role: editUser.role,
          password: passwordData.newPassword
        }),
      });
      
      if (!res.ok) throw new Error("Password change failed");
      
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setSuccessMessage("Password updated!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    setProcessing(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("Couldn't delete user");
      
      setUsers(users.filter((u) => u.id !== id));
      setSuccessMessage("User removed");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>Error: </strong>
        {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded shadow">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">
              Welcome, <span className="font-semibold text-blue-600">{currentUser.name}</span>! 
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {currentUser.role}
              </span>
            </p>
          </div>
          <button
            onClick={logout}
            disabled={processing}
            className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            Logout
          </button>
        </div>

        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            {successMessage}
          </div>
        )}

        {editUser && (
          <div className="mb-6 bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Edit: {editUser.name}
            </h2>
            
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setShowPasswordForm(false)}
                className={`px-3 py-1 rounded ${!showPasswordForm ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Profile
              </button>
              <button
                onClick={() => setShowPasswordForm(true)}
                className={`px-3 py-1 rounded ${showPasswordForm ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Password
              </button>
            </div>
            
            {!showPasswordForm ? (
              <form onSubmit={handleUpdate} className="space-y-3 max-w-md">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    disabled={processing}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    disabled={processing}
                  />
                </div>
                {currentUser.role === "admin" && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Role</label>
                    <select
                      value={editUser.role}
                      onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                      disabled={processing}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {processing ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    disabled={processing}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    disabled={processing}
                    minLength="6"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    disabled={processing}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {processing ? "Updating..." : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    disabled={processing}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="bg-white rounded shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">
              Users
            </h2>
            <p className="text-gray-600">Manage system users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">Name</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">Email</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">Role</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium mr-2">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-medium">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={processing}
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50 text-sm"
                        >
                          Edit
                        </button>
                        {currentUser.role === "admin" && user.id !== currentUser.id && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={processing}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50 text-sm"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    <div className="mt-8 text-center text-gray-500 text-sm">
      <p>Made by Anup Kumar. All rights reserved.</p>
    </div>
    </div>
  );
}