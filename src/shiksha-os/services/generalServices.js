import axios from "axios";
import { useNavigate } from "react-router-dom";

const Logout = (e) => {
  const navigate = useNavigate();
  sessionStorage.setItem("token", null);
  return navigate("/");
};

export async function get(url, headers = {}) {
  return await axios.get(url, {
    ...headers?.headers,
    "Access-Control-Allow-Origin": " ",
  });
}

export async function post(url, body, headers = {}) {
  return await axios.post(url, body, {
    ...headers,
    headers: { ...headers?.headers, "Access-Control-Allow-Origin": " " },
  });
}

export async function update(url, body, headers = {}) {
  return await axios.put(url, body, {
    ...headers,
    headers: { ...headers?.headers, "Access-Control-Allow-Origin": " " },
  });
}

export async function distory(url, body) {}
