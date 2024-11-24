import { RouteType } from "@/types";
import BaseService from "@/utils/BaseService";

class RouteService extends BaseService<RouteType> {
  constructor() {
    super("http://localhost:8080/api/v1/routes");
  }
  getAllRoutes = this.getAll.bind(this);
  createRoute = (body: Partial<RouteType>) => {
    body._id = undefined;
    return this.create(body);
  };
  updateRoute = this.update.bind(this);
  getRoutes = this.getById.bind(this);
  deleteRoutes = this.delete.bind(this);
}

const route = new RouteService();
export { route };
