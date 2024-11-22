import { RouteType } from "@/types";
import axios, { AxiosInstance } from "axios";

class Route {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8080/api/v1/routes",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    });

    this.getAllRoutes = this.getAllRoutes.bind(this);
    this.createRoute = this.createRoute.bind(this);
    this.getRoutes = this.getRoutes.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  getAllRoutes = async (id: string) => {
    const response = await this.api.get(`?sort=routeNumber&user=${id}`);
    if (response.status === 200) return response.data.data;
  };

  createRoute = async (body: Partial<RouteType>) => {
    body._id = undefined;
    const response = await this.api.post("/", body);
    if (response.status === 200) return response.data.data;
  };

  deleteRoute = async (id: string) => {
    const response = await this.api.delete(`/${id}`);
    if (response.status === 200) return response.data.data;
  };

  getRoutes = async (id: number) => {
    const response = await this.api.get(`/${id}`);
    if (response.status === 200) return response.data.data;
  };

  updateRoute = async (body: RouteType) => {
    const response = await this.api.patch(`/${body._id}`, body);
    if (response.status === 200) return response.data.data;
  };

  getToken = () => {
    return localStorage.getItem("token");
  };
}

const route = new Route();
export { route };
