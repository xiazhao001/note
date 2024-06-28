import {Model} from "sequelize";

/**
 * ts需要类型
 */
export interface NotesModelType {
    uid: string;
    className: string;
    content: string;
    markdown: string;
    interception: string;
}

/**
 * db返回的数据类型
 */
export interface DBNotesType {
    readonly uid: string;
    className: string;
    content: string;
    markdown: string;
    interception: string;
    readonly createAt: Date;
    updatedAt: Date;
}

/**
 * 列表数据
 */
export interface DBNotesListType extends DBNotesType {
    remove?: boolean;
}

/**
 * sequelize model
 */
export interface NotesModel extends Model<NotesModelType>, NotesModelType{}