import ROLE from "./role.js";

export class Employee {
  constructor(id, name, role, accessKey) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.accessKey = accessKey;
  }

  changeRole(change) {
    if (change instanceof ROLE) {
      this.role = change;
    }
  }

  authenticate() {}
}

export default Employee;
