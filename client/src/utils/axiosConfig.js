import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkError(error) ||
      axiosRetry.isRetryableError(error) ||
      error.code === 'ECONNABORTED' ||
      (error.response && error.response.status >= 500)
    );
  },
  onRetry: (retryCount, error) => {
    console.log(`Retrying... attempt ${retryCount} — ${error.message}`);
  },
});

axios.defaults.timeout = 30000;

export default axios;
