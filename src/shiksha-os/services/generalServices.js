import axios from "axios";

export async function get(url, headers = {}) {
  return await axios.get(url, headers);
}

export async function post(url, body, headers = {}) {
  return await axios.post(url, body, headers);
}

export async function update(url, body) {}

export async function distory(url, body) {}
