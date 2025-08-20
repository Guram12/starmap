import Link from 'next/link';

export default function Login() { 
  return (
    <div className="login-page">
      <h1>Login</h1>
      <form>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link href="/auth/register">Register here</Link></p>
    </div>
  );
}