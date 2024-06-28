// sequelize 是基于nodejs的数据库中间件

import { Sequelize } from "sequelize";
import sqlite3 from "sqlite3";

// 操作数据库中间件
let sequelize: Sequelize = new Sequelize({
    database: "reading",
    dialect: 'sqlite',
    storage: "test.db",
    dialectModule: sqlite3,
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
})

// 初始化数据库
const sequelizeInit = () : void => {
    sequelize
    .authenticate()
    .then(()=>{
        console.log("连接数据库成功!")
    })
    .catch(err => {
        console.error("连接数据库失败", err)
    })
    //创建数据库
    sequelize
    .sync()
    .then(()=>{
        console.log("初始化db完成")
    })
    .catch(err=>{
        console.error("初始化数据库失败", err)
    })
}

export {
    sequelize, sequelizeInit
}