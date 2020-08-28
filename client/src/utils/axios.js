import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'http://localhost:8888',
  withCredentials: true,
});

// axios.interceptors.response.use((res) => {
//   if (res.data.type === 'auth') {
//   }
//   return res;
// }, (err) => {
//   if (err.message === "Network Error") {
//     console.log('-----------');
//     return 'Error'
//   }
// })


export default axios;