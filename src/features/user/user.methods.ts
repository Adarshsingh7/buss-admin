import { UserType } from "@/types";
import BaseService from "@/utils/BaseService";

class UserService extends BaseService<UserType> {
  constructor() {
    super("http://localhost:8080/api/v1/users");
  }
  getAllUsers = this.getAll.bind(this);
  createUser = (body: Partial<UserType>) => {
    body._id = undefined;
    return this.create(body);
  };
  updateUser = this.update.bind(this);
  getUsers = this.getById.bind(this);
  deleteUsers = this.delete.bind(this);
}

const userService = new UserService();
export { userService };
