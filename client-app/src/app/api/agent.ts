import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activitiy";
import delay from "delay";
import { history } from "../..";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.response.use(undefined, error => {
  const { status, data, config } = error.response;

  if (error.message === "Network error" && !error.response) {
    toast.error("Network error :(");
  }

  if (status === 404) {
    history.push("/notfound");
    return true;
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
    return true;
  }
  if (status === 500) {
    toast.error("Server error - check the terminal");
    history.push("/notfound");
  }
  return false;
});

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody)
};

const sleep = (ms: number) => (response: any) => {
  return delay(ms).then(() => response);
};

const Activities = {
  list: (): Promise<IActivity[]> =>
    requests.get("/activities").then(sleep(1000)),
  details: (id: string): Promise<IActivity> =>
    requests.get(`/activities/${id}`).then(sleep(1000)),
  create: (activity: IActivity): Promise<{}> =>
    requests.post("/activities", activity).then(sleep(1000)),
  update: (activity: IActivity): Promise<{}> =>
    requests.put(`/activities/${activity.id}`, activity).then(sleep(1000)),
  delete: (id: string): Promise<{}> =>
    requests.delete(`/activities/${id}`).then(sleep(1000))
};

export default {
  Activities
};
