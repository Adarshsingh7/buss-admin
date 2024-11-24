import axios, { AxiosInstance, AxiosResponse } from "axios";

class BaseService<T> {
  protected api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  // Fetch all resources
  async getAll(queryParams: Record<string, any> = {}): Promise<T[]> {
    const queryString = new URLSearchParams(queryParams).toString();
    const response: AxiosResponse<{ data: T[] }> = await this.api.get(
      `?${queryString}`,
    );
    return response.data.data;
  }

  // Fetch a single resource by ID
  async getById(id: string | number): Promise<T> {
    const response: AxiosResponse<{ data: T }> = await this.api.get(`/${id}`);
    return response.data.data;
  }

  // Create a new resource
  async create(data: Partial<T>): Promise<T> {
    const response: AxiosResponse<{ data: T }> = await this.api.post("/", data);
    return response.data.data;
  }

  // Update an existing resource by ID
  async update(id: string | number, data: Partial<T>): Promise<T> {
    const response: AxiosResponse<{ data: T }> = await this.api.patch(
      `/${id}`,
      data,
    );
    return response.data.data;
  }

  // Delete a resource by ID
  async delete(id: string | number): Promise<T> {
    const response: AxiosResponse<{ data: T }> = await this.api.delete(
      `/${id}`,
    );
    return response.data.data;
  }

  // Get token for authorization
  private getToken(): string | null {
    return localStorage.getItem("token");
  }
}

export default BaseService;
