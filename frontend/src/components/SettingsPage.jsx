import { useState } from 'react';
import { changePassword } from '../adapters/auth-adapters';

function SettingsPage({ isDarkMode, toggleDarkMode }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    const { error: err } = await changePassword(currentPassword, newPassword);
    if (err) {
      setError('Current password is incorrect.');
    } else {
      setSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <section>
      <h1 className="dashboard-greeting">Settings</h1>

      <div className="settings-card">
        <div className="settings-card-header">
          <h2>Change Password</h2>
        </div>
        <div className="settings-card-body">
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="field">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-msg">{error}</p>}
            {success && <p className="success-msg">{success}</p>}
            <button className="btn-settings-save" type="submit">Update Password</button>
          </form>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-header">
          <h2>Appearance</h2>
        </div>
        <div className="settings-card-body">
          <div className="settings-row">
            <div>
              <p className="settings-row-label">Dark Mode</p>
              <p className="settings-row-desc">Switch to a darker color scheme</p>
            </div>
            <button
              type="button"
              className={`toggle${isDarkMode ? ' toggle-on' : ''}`}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              <span className="toggle-thumb" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SettingsPage;
