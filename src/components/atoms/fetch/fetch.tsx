import { useFetch } from "hooks/use-fetch";

interface FetchProps<T> {
  uri: string | null;
  renderData: (data: T) => JSX.Element;
  loadingFallback?: JSX.Element;
}

const Fetch = <T,>({
  uri,
  renderData,
  loadingFallback = <div>Loading...</div>,
}: FetchProps<T>) => {
  const { loading, data, hasData } = useFetch<T>(uri);
  if (loading) {
    return loadingFallback;
  }
  if (hasData && data) {
    return renderData(data);
  }
  return <></>;
};

export { Fetch };
