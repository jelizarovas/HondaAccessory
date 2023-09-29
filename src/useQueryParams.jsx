import { useHistory, useLocation } from "react-router-dom";
import { useCallback } from "react";

function useQueryParams() {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const getParam = useCallback(
    (key) => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const setParam = useCallback(
    (key, value) => {
      searchParams.set(key, value);
      history.push({
        search: searchParams.toString(),
      });
    },
    [history, searchParams]
  );

  const removeParam = useCallback(
    (key) => {
      searchParams.delete(key);
      history.push({
        search: searchParams.toString(),
      });
    },
    [history, searchParams]
  );

  return {
    getParam,
    setParam,
    removeParam,
  };
}

export default useQueryParams;
