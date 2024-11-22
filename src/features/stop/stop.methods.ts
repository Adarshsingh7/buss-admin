import { StopType } from "@/types";
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

  createStop = async (body: Partial<StopType>) => {
    body._id = undefined;
    const response = await this.api.post("/", body);
    if (response.status === 200) return response.data.data;
  };

  deleteStop = async (id: string) => {
    const response = await this.api.delete(`/${id}`);
    if (response.status === 200) return response.data.data;
  };

  getStops = async (id: number) => {
    const response = await this.api.get(`/${id}`);
    if (response.status === 200) return response.data.data;
  };

  updateStop = async (body: StopType) => {
    const response = await this.api.patch(`/${body._id}`, body);
    if (response.status === 200) return response.data.data;
  };

  getToken = () => {
    return localStorage.getItem("token");
  };
}

const stop = new Stop();
export { stop };
