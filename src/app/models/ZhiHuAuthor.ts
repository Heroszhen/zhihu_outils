import { Model } from "./Model";

export class ZhiHuAuthor extends Model{
    id: number|null = null;
    name!: string;
    photo!:string;
    link!: string;
    public static readonly tableName = "zhi_hu_author";

    constructor() {
        super();
    }
}