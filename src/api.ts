export const fetchData = <T>(name: T): Readable<T> => {
  return wrapPromise(readData(name));
};

type FetchStatus = "pending" | "resolved" | "rejected";

const wrapPromise = <T>(promise: Promise<T>) => {
  let status: FetchStatus = "pending";
  let result: T;
  const suspender = promise
    .then((r) => {
      status = "resolved";
      result = r;
    })
    .catch((e) => {
      status = "rejected";
      result = e;
    });
  return {
    read: () => {
      if (status === "pending") {
        throw suspender;
      } else if (status === "rejected") {
        throw result;
      } else if (status === "resolved") {
        return result;
      }

      // To stop typescript from complaining.
      throw new Error("invalid state reached.");
    },
  };
};

const readData = <T>(name: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(name);
    }, 1000);
  });
};

export interface Readable<T> {
  read: () => T;
}
