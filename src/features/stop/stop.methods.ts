import axios, { AxiosInstance } from "axios";

class Stop {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8080/api/v1/stop",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    });

    this.getAllStops = this.getAllStops.bind(this);
    this.getStops = this.getStops.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  getAllStops = async () => {
    try {
      const response = await this.api.get("/");
      if (response.status === 200) return response.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  getStops = async (id: number) => {
    try {
      const response = await this.api.get(`/${id}`);
      if (response.status === 200) return response.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  getToken = () => {
    return localStorage.getItem("token");
  };
}

const stop = new Stop();
export { stop };
