import React, { useState, useDeferredValue, useMemo } from "react";

interface IsPrimeProps {
  currentNum: number;
}

const IsPrime = (props: IsPrimeProps) => {
  const { currentNum } = props;

  let isPrime = currentNum !== 1;

  // We do this 100 times to slow it down further.
  for (let _i = 0; _i < 100; _i++) {
    for (let i = 2; i <= currentNum - 1; i++) {
      if (currentNum % i === 0) {
        isPrime = false;
        break;
      }
    }
  }

  if (!isPrime) {
    return <></>;
  }

  return (
    <div
      style={{
        display: "inline-block",
        width: 50,
      }}
    >
      {currentNum}
    </div>
  );
};

interface FindPrimeFormProps {
  min: number;
  setMin: (arg0: number) => void;

  max: number;
  setMax: (arg0: number) => void;
}

const FindPrimeForm = (props: FindPrimeFormProps) => {
  const { min, setMin, max, setMax } = props;

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <div style={{ display: "inline-block", width: 60, fontSize: 12 }}>
          From:{" "}
        </div>
        <input
          type="range"
          min="1"
          max="10000"
          value={min.toString()}
          onChange={(e) => {
            setMin(parseInt(e.target.value));
          }}
        />
        <div
          style={{
            paddingLeft: 5,
            display: "inline-block",
            width: 60,
            fontSize: 12,
          }}
        >
          {min}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <div style={{ display: "inline-block", width: 60, fontSize: 12 }}>
          To:{" "}
        </div>
        <input
          type="range"
          min="1"
          max="10000"
          value={max.toString()}
          onChange={(e) => {
            setMax(parseInt(e.target.value));
          }}
        />
        <div
          style={{
            paddingLeft: 5,
            display: "inline-block",
            width: 60,
            fontSize: 12,
          }}
        >
          {max}
        </div>
      </div>
    </>
  );
};

export const FindPrimePreConcurrent = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);

  const primeDisplay = [];

  for (let i = min; i <= max; i++) {
    primeDisplay.push(<IsPrime key={i} currentNum={i} />);
  }

  return (
    <div>
      <h5>Find Prime</h5>

      <FindPrimeForm min={min} max={max} setMin={setMin} setMax={setMax} />

      <div style={{ width: 300, height: 300, overflowY: "auto" }}>
        {primeDisplay}
      </div>
    </div>
  );
};

export const FindPrimePostConcurrent = () => {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);

  const delayedMin = useDeferredValue(min);
  const delayedMax = useDeferredValue(max);

  const primeDisplay = useMemo(() => {
    const components = [];

    for (let i = delayedMin; i <= delayedMax; i++) {
      components.push(<IsPrime key={i} currentNum={i} />);
    }

    return components;
  }, [delayedMin, delayedMax]);

  return (
    <div>
      <h5>Find Prime Delay</h5>

      <FindPrimeForm min={min} max={max} setMin={setMin} setMax={setMax} />

      <div style={{ width: 300, height: 300, overflowY: "auto" }}>
        {primeDisplay}
      </div>
    </div>
  );
};
