import { useState, useEffect } from "react";

const useFetch = <T>(uri: string | null) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!uri) {
      return;
    }
    setLoading(true);
    fetch(uri)
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          setHasError(true);
          return { error: response.text };
        }
        return response.json();
      })
      .then((json) => {
        setHasData(true);
        setData(json);
      })
      .catch((err) => {
        setHasError(true);
        setError(err);
      });
  }, [uri]);

  return {
    loading,
    data,
    hasData,
    error,
    hasError,
  };
};

export { useFetch };
