/**
 * @file useFetch.ts
 * @description A custom hook to fetch data from an API.
 */

// IMPORTS ===================================================================================================  IMPORTS
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
interface IFetchedData {
  data: object;
  isLoading: boolean;
  error: boolean;
}
// END VARIABLES =======================================================================================  END VARIABLES

const useFetch = (url: string): IFetchedData => {
  // States
  const [fetchedData, setFetchedData] = useState<IFetchedData>({
    data: {},
    isLoading: true,
    error: false,
  });

  const cancelToken = axios.CancelToken.source();

  const fetchData = useCallback( () => {
    axios.get(url, { cancelToken: cancelToken.token })
      .then((response) => {
        const data = response.data;

        if (data) {
          setFetchedData({
            data: data.results ?? data,
            isLoading: false,
            error: false
          });
        }
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          setFetchedData({ data: [], isLoading: false, error: true });
        }
      });
  }, [url]);

  useEffect(() => {
    fetchData();

    return () => {
      cancelToken.cancel();
    };
  }, [url, fetchData]);

  const { data, isLoading, error } = fetchedData;

  return { data, isLoading, error };
}

export default useFetch;

/**
 * End of file src/hooks/use-fetch.ts
 */
