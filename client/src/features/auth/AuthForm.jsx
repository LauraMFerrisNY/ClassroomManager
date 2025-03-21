import 'dotenv/config'
import { useState , useEffect } from "react";
import { useLoginMutation, useRegisterMutation } from "./authSlice";

/**
 * AuthForm allows a user to either login or register for an account.
 */
function AuthForm() {
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const authType = isLogin ? "Login" : "Register";
  const oppositeAuthCopy = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  const oppositeAuthType = isLogin ? "Register" : "Login";

  /**
   * Send credentials to server for authentication
   */
  async function attemptAuth(event) {
    event.preventDefault();
    setError(null);

    const authMethod = isLogin ? login : register;
    const credentials = { username, password };

    try {
      setLoading(true);
      await authMethod(credentials).unwrap();
    } catch (error) {
      setLoading(false);
      setError(error.data);
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    console.log(codeParam);
  }, []);

  async function attepmtGitHubAuth() {
    setError(null);
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + process.env.GITHUB_OAUTH_CLIENT_ID);

    // try {
    //   setLoading(true);
      
    // } catch (error) {
    //   setLoading(false);
    //   setError(error.data);
    // }
  }

  return (
    <main>
      <h1>{authType}</h1>
      <form onSubmit={attemptAuth} name={authType}>
        <label>
          Username
          <input
            type="text"
            name="username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </label>
        <button type="submit">{authType}</button>
      </form>
      <button id="github-btn" onClick={attepmtGitHubAuth}>{authType} with Github</button>
      <p>
        {oppositeAuthCopy}{" "}
        <a
          onClick={() => {
            setIsLogin(!isLogin);
          }}
        >
          {oppositeAuthType}
        </a>
      </p>
      {loading && <p>Logging in...</p>}
      {error && <p>{error}</p>}
    </main>
  );
}

export default AuthForm;
