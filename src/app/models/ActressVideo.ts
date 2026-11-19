import { Video } from "./actress";
import { Model } from "./Model";

export class ActressVideo extends Model {
  videos: Video[] = [];
  filters: Record<string, string | boolean | string[] | number> = {};
  videoIndex: number = 0;
  public static readonly tableName = "actress_video";

  constructor() {
    super();
  }
}
