import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const MyApplications = () => {
  // Initialize state from Local Storage
  const [apps, setApps] = useState(() => {
    const savedApps = localStorage.getItem('myApplications');
    return savedApps ? JSON.parse(savedApps) : [
      { id: 1, company: "Google", role: "Software Engineer Intern", status: "Interviewing", date: "2025-12-19" },
      { id: 2, company: "Adobe", role: "Junior Frontend Developer", status: "Applied", date: "2025-12-18" },
      { id: 3, company: "TechCrunch", role: "Technical Analyst", status: "Saved", date: "2025-12-17" },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApp, setNewApp] = useState({ company: '', role: '', status: 'Saved' });
  const [editingId, setEditingId] = useState(null);

  // ✅ NEW: State for the Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  // Save to Local Storage whenever 'apps' changes
  useEffect(() => {
    localStorage.setItem('myApplications', JSON.stringify(apps));
    window.dispatchEvent(new Event("storage"));
  }, [apps]);

  // ✅ NEW: Open the delete modal instead of window.confirm
  const initiateDelete = (id) => {
    setDeleteModal({ show: true, id });
  };

  // ✅ NEW: Actually delete the item
  const confirmDelete = () => {
    if (deleteModal.id) {
      setApps(apps.filter(app => app.id !== deleteModal.id));
      setDeleteModal({ show: false, id: null });
    }
  };

  // ✅ NEW: Cancel deletion
  const cancelDelete = () => {
    setDeleteModal({ show: false, id: null });
  };

  const handleEditClick = (app) => {
    setEditingId(app.id);
    setNewApp({
      company: app.company,
      role: app.role,
      status: app.status
    });
    setIsModalOpen(true);
  };

  const handleSaveEntry = (e) => {
    e.preventDefault();
    if (editingId) {
      setApps(apps.map(app => 
        app.id === editingId ? { ...app, ...newApp } : app
      ));
    } else {
      const entry = {
        ...newApp,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      setApps([entry, ...apps]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewApp({ company: '', role: '', status: 'Saved' });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <div className="top-header ma-animate">
          <div className="header-text">
            <h1>Application Tracker <i className="fa-solid fa-layer-group" style={{color: 'var(--accent)'}}></i></h1>
            <p>Manage your professional pipeline and interview progress.</p>
          </div>
          <button className="ma-btn-add" onClick={() => setIsModalOpen(true)}>
            <i className="fa-solid fa-plus"></i> Add New Entry
          </button>
        </div>

        <div className="ma-container ma-animate">
          <div className="ma-card">
            <div className="ma-table-wrapper">
              <table className="ma-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Position</th>
                    <th>Date Tracked</th>
                    <th>Pipeline Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map(app => (
                    <tr key={app.id}>
                      <td><div className="ma-company"><strong>{app.company}</strong></div></td>
                      <td className="ma-role">{app.role}</td>
                      <td className="ma-date">{app.date}</td>
                      <td>
                        <span className={`ma-status-badge ${app.status.toLowerCase()}`}>
                          <i className="fa-solid fa-circle" style={{fontSize: '0.5rem', marginRight: '8px'}}></i>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="ma-actions">
                           <button 
                              className="ma-edit-btn"
                              title="Edit Entry" 
                              onClick={() => handleEditClick(app)}
                           >
                              <i className="fa-solid fa-pen-to-square"></i>
                           </button>
                           
                           {/* Updated Delete Button to use initiateDelete */}
                           <button 
                              className="ma-delete-btn"
                              title="Delete" 
                              onClick={() => initiateDelete(app.id)} 
                              style={{color: '#ef4444'}}
                           >
                             <i className="fa-solid fa-trash-can"></i>
                           </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Existing Add/Edit Modal */}
        {isModalOpen && (
          <div className="ma-modal-overlay active">
            <div className="ma-modal">
              <div className="ma-modal-header">
                <h3>{editingId ? "Edit Application" : "Track New Application"}</h3>
                <p>{editingId ? "Update the details of your application." : "Fill in the details to update your career pipeline."}</p>
              </div>
              
              <form onSubmit={handleSaveEntry}>
                <div className="ma-input-group">
                  <label className="ma-label">Company Name</label>
                  <input 
                    className="ma-glass-input" 
                    placeholder="e.g. Google, Meta..." 
                    required 
                    value={newApp.company}
                    onChange={(e) => setNewApp({...newApp, company: e.target.value})}
                  />
                </div>
                <div className="ma-input-group">
                  <label className="ma-label">Position / Role</label>
                  <input 
                    className="ma-glass-input" 
                    placeholder="e.g. React Developer..." 
                    required 
                    value={newApp.role}
                    onChange={(e) => setNewApp({...newApp, role: e.target.value})}
                  />
                </div>
                <div className="ma-input-group">
                  <label className="ma-label">Pipeline Status</label>
                  <select 
                    className="ma-glass-input"
                    value={newApp.status}
                    onChange={(e) => setNewApp({...newApp, status: e.target.value})}
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                  </select>
                </div>
                <div className="ma-modal-actions">
                  <button type="submit" className="ma-btn-save">
                    {editingId ? "Update Entry" : "Save Entry"}
                  </button>
                  <button type="button" className="ma-btn-cancel" onClick={closeModal}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ✅ NEW: CUSTOM DELETE CONFIRMATION MODAL */}
        {deleteModal.show && (
          <div className="dm-overlay">
            <div className="dm-modal">
              <div className="dm-icon-box">
                <i className="fa-solid fa-triangle-exclamation"></i>
              </div>
              <h2 className="dm-title">Delete Entry?</h2>
              <p className="dm-text">
                Are you sure you want to remove this application from your tracker? This action cannot be undone.
              </p>
              <div className="dm-buttons">
                <button className="dm-btn-cancel" onClick={cancelDelete}>Cancel</button>
                <button className="dm-btn-delete" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyApplications;