import { useState, useEffect } from "react";

function useFetchJSON(path, shouldCache = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const basePath = import.meta.env.BASE_URL;

  useEffect(() => {
    const finalPath = shouldCache ? `${basePath}${path}` : `${basePath}${path}?_=${new Date().getTime()}`; // Append a timestamp to bypass cache

    fetch(finalPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [path, shouldCache]); // Dependency on 'path' and 'shouldCache' ensures the fetch re-runs if either changes

  return { data, loading, error };
}

export default useFetchJSON;
