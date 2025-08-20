import Link from 'next/link';

export default function Register() {  // Capitalize component name
  return (
    <div className="register-page">
      <h1>Register</h1>
      <form>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link href="/auth/login">Login here</Link></p>
    </div>
  );
}