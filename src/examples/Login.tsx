import React, { Suspense, useState, useTransition } from "react";
import { fetchData, Readable } from "../api";

interface LoginFormProps {
  onSubmit: (username: string, password: string) => void;
  busy: boolean;
  wrong: boolean;
}

const LoginForm = (props: LoginFormProps) => {
  const { busy, onSubmit, wrong } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div>
        <input
          placeholder="Username"
          disabled={busy}
          style={{
            width: 150,
            ...(busy ? { backgroundColor: "rgb(240, 240 ,240)" } : {}),
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Password"
          type="password"
          disabled={busy}
          style={{
            width: 150,
            ...(busy ? { backgroundColor: "rgb(240, 240 ,240)" } : {}),
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ textAlign: "right" }}>
        {!busy && wrong && (
          <span style={{ fontSize: 12, color: "red" }}>Wrong Password. </span>
        )}
        {busy && <span style={{ fontSize: 12 }}>Logging In... </span>}

        <button onClick={() => onSubmit(username, password)} disabled={busy}>
          Login
        </button>
      </div>
    </>
  );
};

interface AfterLoginProps {
  username: string;
}

const AfterLogin = (props: AfterLoginProps) => {
  const { username } = props;

  return <h5>Hello, {username}!</h5>;
};

interface LoginContentProps {
  user: null | Readable<string | null>;
  busy: boolean;
  onSubmit: (username: string, password: string) => void;
}

const LoginContent = (props: LoginContentProps) => {
  const { user, busy, onSubmit } = props;

  const username = user && (busy ? null : user.read());

  return user && username ? (
    <AfterLogin username={username} />
  ) : (
    <LoginForm
      onSubmit={onSubmit}
      busy={busy}
      wrong={user !== null && username === null}
    />
  );
};

export const LoginPreConcurrent = () => {
  const [user, setUser] = useState<Readable<string | null> | null>(null);

  const onSubmit = (u: string, p: string) => {
    if (p === "12345") {
      setUser(fetchData(u));
    } else {
      setUser(fetchData(null));
    }
  };

  return (
    <div style={{ width: 150, height: 120 }}>
      <h5>Login w/ Fallback</h5>

      <Suspense fallback={<h5>Logging In...</h5>}>
        <LoginContent onSubmit={onSubmit} busy={false} user={user} />
      </Suspense>
    </div>
  );
};

export const LoginPostConcurrent = () => {
  const [user, setUser] = useState<Readable<string | null> | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (u: string, p: string) => {
    startTransition(() => {
      if (p === "12345") {
        setUser(fetchData(u));
      } else {
        setUser(fetchData(null));
      }
    });
  };

  return (
    <div style={{ width: 150, height: 120 }}>
      <h5>Login w/out Fallback</h5>

      <Suspense fallback={<h5>Logging In...</h5>}>
        <LoginContent onSubmit={onSubmit} busy={isPending} user={user} />
      </Suspense>
    </div>
  );
};
