import axios from "axios";
const setAuthToken = token => {
  //apply token to every request
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  }
  //otherwise delete auth header
  else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
