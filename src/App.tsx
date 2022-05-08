import React from "react";
import { LoginPreConcurrent, LoginPostConcurrent } from "./examples/Login";
import {
  FindPrimePreConcurrent,
  FindPrimePostConcurrent,
} from "./examples/FindPrime";
import {
  PageNaviPreConcurrent,
  PageNaviPostConcurrent,
} from "./examples/PageNavi";

function App() {
  return (
    <div>
      <div style={{ padding: 15 }}>
        <LoginPreConcurrent />
      </div>

      <div style={{ padding: 15 }}>
        <LoginPostConcurrent />
      </div>

      <div style={{ padding: 15 }}>
        <FindPrimePreConcurrent />
      </div>

      <div style={{ padding: 15 }}>
        <FindPrimePostConcurrent />
      </div>

      <div style={{ padding: 15 }}>
        <PageNaviPreConcurrent />
      </div>

      <div style={{ padding: 15 }}>
        <PageNaviPostConcurrent />
      </div>
    </div>
  );
}

export default App;
