import {sequelize} from "../initSequelize";
import {STRING} from "sequelize";
import {uuid} from "../../utils"
import { NotesModel } from "@/types/notes";

/**
 * 创建sequelize数据模型，用来操作数据库
 */
export const Notes = sequelize.define<NotesModel>(
    "notes",
    {
      uid: {
        type: STRING,
        primaryKey: true,
        defaultValue: uuid(),
        allowNull: false,
        /**
         * 是否可重复
         */
        unique: false
      },
      className: STRING(32),
      content: STRING(9999999),
      markdown: STRING(9999999),
      interception: STRING(500)
    },
    {
      timestamps: true
    }
  );

  Notes.sync({
    alter: true
  })