export abstract class Model {
  id?: string;
  assignData(data: object): void {
    Object.assign(this, data);
  }
}
