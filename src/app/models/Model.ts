export abstract class Model {
  id?: string;

  assignData(data: Partial<this>): void {
    Object.assign(this, data);
  }
}
