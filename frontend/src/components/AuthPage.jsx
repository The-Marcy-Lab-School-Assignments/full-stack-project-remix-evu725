import { useState } from 'react';

function LoginForm({ handleLogin, switchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await handleLogin(username, password);
    if (error) {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className='aa'>•ᴗ•</p>
      <h1>Budget Buddy</h1>
      <p className='subtext'>Where everything goes, here it is</p>
      <h2>Log In</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {errorMessage && <p className="error">{errorMessage}</p>}

      <button type="submit">Log In</button>

      <p>
        Don't have an account?{' '}
        <button type="button" onClick={switchToRegister}>
          Click here
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ handleRegister, switchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await handleRegister(username, password);
    if (error) {
      setErrorMessage('Could not register. Username may already be taken.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {errorMessage && <p className="error">{errorMessage}</p>}

      <button type="submit">Register</button>

      <p>
        Already have an account?{' '}
        <button type="button" onClick={switchToLogin}>
          Log in here
        </button>
      </p>
    </form>
  );
}

function AuthPage({ handleLogin, handleRegister }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div id="auth-section">
      
      {isLogin ? (
        <LoginForm
          handleLogin={handleLogin}
          switchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          handleRegister={handleRegister}
          switchToLogin={() => setIsLogin(true)}
        />
      )}
    </div>
  );
}

export default AuthPage;
