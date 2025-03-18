import { SchoolType } from "@/types";
import BaseService from "@/utils/BaseService";

class SchoolService extends BaseService<SchoolType> {
  constructor() {
    super("http://localhost:8080/api/v1/school");
  }
  getAllSchools = this.getAll.bind(this);
  createSchool = (body: Partial<SchoolType>) => {
    body._id = undefined;
    return this.create(body);
  };
  updateSchool = this.update.bind(this);
  getSchool = this.getById.bind(this);
  deleteSchool = this.delete.bind(this);
}

const schoolService = new SchoolService();
export { schoolService };
