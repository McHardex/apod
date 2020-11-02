import axios from 'axios';

const http = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
      accept: 'application/json',
      'Content-type': 'application/json; charset=UTF-8'
    }
  });

  type Response = {
    status: number;
  };
  type Error = {
    message: string;
    response: Response;
  };

  const unauthorizedRequestInterceptor = async (error: Error) => {
    if (error.message === 'Network Error') {
      console.log('Network error'); // eslint-disable-line no-console
    }

    return Promise.reject(error);
  };

  axiosInstance.interceptors.response.use((response) => response, unauthorizedRequestInterceptor);

  return axiosInstance;
};

export default http;
