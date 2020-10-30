import http from 'api';

const API_KEY = process.env.REACT_APP_API_KEY;

const apodService = {
  getPictureOfTheDay(today: string) {
    return http().get(`?api_key=${API_KEY}&date=${today}`);
  }
};

export default apodService;
