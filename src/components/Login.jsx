export default function Login() {
  return (
    <div className="w-full h-full">
        <h1>Sign in to FriendZone</h1>
        <form action="/login" method="POST">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" />
            <button type="submit">Sign in</button>
        </form>
        <button>Join as visitor</button>
        <button>Reset Password</button>
        <div>No Account? <button>Sign Up!</button></div>
    </div>
  )
}
