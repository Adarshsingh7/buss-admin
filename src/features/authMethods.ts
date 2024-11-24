import { UserType } from "@/types";
import axios, { AxiosInstance } from "axios";

class Auth {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8080/api/v1/users",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.getToken = this.getToken.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login = async (body: { email: string; password: string }) => {
    const response = await this.api.post("/login", body);
    console.log(response.data);
    this.setToken(response.data.token);
    return response.data.user;
  };

  getAllUser = async () => {
    const response = await this.api.post("/");
    if (response.status === 200) this.setToken(response.data.token);
    return response.data.user;
  };

  signup = async (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<UserType> => {
    const response = await this.api.post<{ user: UserType }>("/signup", data);
    return response.data.user;
  };

  isAuthenticated = async () => {
    try {
      const currentUser = await this.api.get("/me", {
        headers: { Authorization: `Bearer ${this.getToken()}` },
      });
      return currentUser.data.user;
    } catch (error) {
      console.error("Error checking authentication status:", error);
      return null;
    }
  };

  logout = async () => {
    this.clearToken();
  };

  setToken = (token: string) => {
    localStorage.setItem("token", token);
  };

  clearToken = () => {
    localStorage.removeItem("token");
  };

  getToken = () => {
    return localStorage.getItem("token");
  };
}

const auth = new Auth();
export { auth };
