import { useState } from 'react';

function LoginForm({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = await handleLogin(username, password);
    if (err) setError('Invalid username or password.');
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button className="btn-primary" type="submit">Sign In</button>
      </form>
    </div>
  );
}

function RegisterForm({ handleRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = await handleRegister(username, password);
    if (err) setError('Could not register. Username may already be taken.');
  };

  return (
    <div className="auth-form">
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
            autoFocus
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            required
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button className="btn-primary" type="submit">Create Account</button>
      </form>
    </div>
  );
}

function AuthPage({ handleLogin, handleRegister }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>Budget Buddy</h1>
          <p>Track your spending effortlessly</p>
        </div>
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab${isLogin ? ' active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab${!isLogin ? ' active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        {isLogin
          ? <LoginForm handleLogin={handleLogin} />
          : <RegisterForm handleRegister={handleRegister} />
        }
      </div>
    </div>
  );
}

export default AuthPage;
