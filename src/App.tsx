/** @format */

import { useEffect, useState } from "react";
import "./App.css";
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

const configuration: Configuration = {
  auth: {
    clientId: "3b965048-bbf1-4cce-8ec8-bf735ee31de5",
    redirectUri: "http://localhost:3000/login",
  },
};
const msalInstance = new PublicClientApplication(configuration);

await msalInstance.initialize();

function App() {
  const [token, setToken] = useState("");

  const onClick = async () => {
    const accounts = msalInstance.getAllAccounts();

    if (accounts.length > 0) {
      await msalInstance.logoutPopup();
      setToken("");

      return;
    }

    const result = await msalInstance.loginPopup({
      scopes: ["user.read"],
      account: accounts[0],
    });

    setToken(result.accessToken);
  };

  useEffect(() => {
    const accounts = msalInstance.getAllAccounts();

    if (accounts.length > 0) {
      msalInstance
        .acquireTokenSilent({
          scopes: ["user.read"],
          account: accounts[0],
        })
        .then((result) => setToken(result.accessToken))
        .catch((error) => console.error(error));
    }
  }, []);

  return (
    <main>
      <button onClick={onClick}>login/logout</button>
      <h1>token:</h1>
      <textarea cols={120} rows={20} value={token} disabled />
    </main>
  );
}

export default App;
