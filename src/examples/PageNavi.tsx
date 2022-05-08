import React, {
  Suspense,
  useMemo,
  useState,
  useEffect,
  useTransition,
} from "react";
import { fetchData, Readable } from "../api";

const PageHome = () => {
  return <div>Home Page!</div>;
};

let dataA: Readable<string> | null = null;

const PageA = () => {
  if (dataA === null) {
    dataA = fetchData("Page A!");
  }

  const data = dataA.read();

  return <div>{data}</div>;
};

let dataB: Readable<string> | null = null;

const PageB = () => {
  if (dataB === null) {
    dataB = fetchData("Page B!");
  }
  const data = dataB.read();

  return <div>{data}</div>;
};

interface NavProps {
  setPage: (arg0: null | "a" | "b") => void;
  loading: boolean;
}

interface NavLoadingProps {
  completed: boolean;
}

const NavLoading = (props: NavLoadingProps) => {
  const { completed } = props;

  const [width, setWidth] = useState("0%");

  useEffect(() => {
    setTimeout(() => setWidth("30%"), 0);
  }, []);

  useEffect(() => {
    if (completed) {
      setTimeout(() => setWidth("100%"), 0);
    }
  }, [completed]);

  return (
    <div style={{ height: 3, width: "100%" }}>
      <div
        style={{
          backgroundColor: "lightblue",
          height: 3,
          width,
          transition: "width 0.2s ease",
        }}
      ></div>
    </div>
  );
};

const Nav = (props: NavProps) => {
  const { setPage, loading } = props;
  const [delayedLoading, setDelayedLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      setDelayedLoading(true);
    } else {
      const handle = setTimeout(() => setDelayedLoading(false), 200);

      return () => clearTimeout(handle);
    }
  }, [loading]);

  return (
    <>
      <div
        style={{
          height: 60,
          paddingLeft: 20,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          backgroundColor: "rgb(217, 143, 217)",
          color: "white",
        }}
      >
        <div
          style={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => {
            setPage(null);
          }}
        >
          Home
        </div>
        <div
          style={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => {
            setPage("a");
          }}
        >
          Page A
        </div>
        <div
          style={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => {
            setPage("b");
          }}
        >
          Page B
        </div>
      </div>
      {delayedLoading ? (
        <NavLoading completed={!loading} />
      ) : (
        <div style={{ height: 3, width: "100%" }}></div>
      )}
    </>
  );
};

export const PageNaviPreConcurrent = () => {
  const [page, setPage] = useState<null | "a" | "b">(null);

  const pageComp = useMemo(() => {
    if (page === "a") return <PageA />;
    if (page === "b") return <PageB />;

    return <PageHome />;
  }, [page]);

  return (
    <div style={{ width: 300 }}>
      <h5>Navigate w/ Fallback</h5>

      <Nav setPage={setPage} loading={false} />
      <div style={{ padding: 15, height: 300 }}>
        <Suspense fallback={<div>Loading...</div>}>{pageComp}</Suspense>
      </div>
    </div>
  );
};

export const PageNaviPostConcurrent = () => {
  const [page, setPage] = useState<null | "a" | "b">(null);
  const [isPending, startTransition] = useTransition();

  const pageComp = useMemo(() => {
    if (page === "a") return <PageA />;
    if (page === "b") return <PageB />;

    return <PageHome />;
  }, [page]);

  const navigateTransition = (p: null | "a" | "b") => {
    startTransition(() => {
      setPage(p);
    });
  };

  return (
    <div style={{ width: 300 }}>
      <h5>Navigate w/out Fallback</h5>

      <Nav setPage={navigateTransition} loading={isPending} />
      <div style={{ padding: 15, height: 300 }}>
        <Suspense fallback={<div>Loading...</div>}>{pageComp}</Suspense>
      </div>
    </div>
  );
};
