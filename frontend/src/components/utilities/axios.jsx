import axios from "axios";

// Utility functions, constants, objects...
import { BASE_API_URL } from "./CONSTANTS";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    "X-CSRFToken": csrftoken,
    Authorization: "Bearer " + localStorage.getItem("access"),
    "Accept-Language": localStorage.getItem("language")
  },
});
export default axiosInstance;

export const getRoomsList = (axiosInstance, search = "") => {
  delete axiosInstance.defaults.headers["Authorization"];

  if (search !== "") {
    return axiosInstance.get(`meet/rooms/?search=${search}`);
  }

  return axiosInstance.get("meet/rooms/");
};

export const validateToken = (axiosInstance, token) => {
  return axiosInstance.post("auth/verify/", {
    token: token,
  });
};

export const refreshingAccessToken = () => {
  const access_token = localStorage.getItem("access");
  validateToken(axiosInstance, access_token)
    .then((response) => {
      if (response.status === 200) {
        axiosInstance.defaults.headers["Authorization"] =
          "Bearer " + access_token;
      }
    })
    .catch((error) => {
      const refresh_token = localStorage.getItem("refresh");
      if (
        (error.response.status === 400 || error.response.status === 401) &&
        refresh_token
      ) {
        axiosInstance
          .post("auth/refresh/", {
            refresh: refresh_token,
          })
          .then(({ status, data }) => {
            if (status === 200) {
              localStorage.setItem("access", data.access);
              axiosInstance.defaults.headers["Authorization"] =
                "Bearer " + data.access;
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    });
};
