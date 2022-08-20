import { createContext, useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calcRemainingTime = (expirationTime) => {
  const currentTIme = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTIme;

  return remainingDuration;
};
const retrievetoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationTime = localStorage.getItem("expiratonTime");

  const remainingTime = calcRemainingTime(storedExpirationTime);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("token");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrievetoredToken();

  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  //login state can be inferred from the token state, if user is not logged in, token is an empty string

  const userIsLoggedIn = !!token;

  const loginHandler = useCallback((token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);
    const remainingTime = calcRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  }, []);

  const logoutHandler = () => {
    setToken("");
    localStorage.removeItem("token");
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  };

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);
  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
