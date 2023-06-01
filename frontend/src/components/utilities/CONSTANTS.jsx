// export const BASE_API_URL = window.location.origin + "/api/";  //  Use this for if you wanna serve it Django
export const BASE_API_URL = "http://localhost:8000/api/";   // Use this for stand-alone app 
export const webSocketUrl = () => {
  let websocketProtocol;
  if (window.location.protocol === "https:") {
    websocketProtocol = "wss://";
  } else {
    websocketProtocol = "ws://";
  }
  // return websocketProtocol + window.location.host + "/video/"; //  Use this for if you wanna serve it Django
  return websocketProtocol + "localhost:8080/video/";        // Use this for stand-alone app 
};

export const AVAILABLE_PATHS = {
    LOBBY_PATH: "/",
    LOGIN_PATH: "/login",
    REGISTER_PATH: "/register",
    VIDEO_ROOM_PATH: "/video/:roomId",
    USER_ACTIVATION_PATH: "/activate/:uid/:token",
    PASSWORD_RESET_CONFIRMATION_PATH: "/reset_password/:uid/:token",
    PASSWORD_RESET_PATH: "/password_reset",
    DELETE_ACCOUNT_PATH: "/delete_account",
};

export const ALL_PATH_TITLES = {
    LOBBY_TITLE: "Home",
    LOGIN_TITLE: "Login",
    REGISTER_TITLE: "Register",
    LOGOUT_TITLE: "Logout",
    DELETE_ACCOUNT_TITLE: "Delete Account",
};

export const WEEKDAYS = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
}