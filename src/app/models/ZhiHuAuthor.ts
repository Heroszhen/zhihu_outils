import { Model } from "./Model";

export class ZhiHuAuthor extends Model {
  name!: string;
  photo: string | null = null;
  link!: string;
  public static readonly tableName = "zhi_hu_author";

  constructor() {
    super();
  }
}
