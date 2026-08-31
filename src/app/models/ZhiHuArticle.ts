import { Model } from "./Model";

export class ZhiHuArticle extends Model {
    id: number|null = null;
    title!: string;
    link!: string;
    description!: string;
    public static readonly tableName = "zhi_hu_article";

    constructor() {
        super();
    }
}