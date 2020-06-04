/*1. 连接数据库*/
// 1.1. 引入 mongoose

const mongoose = require('mongoose')

// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin')

// 1.3. 获取连接对象
const conn = mongoose.connection

// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',()=>{
    console.log("db connect success!")
})

/*2. 定义出对应特定集合的 Model 并向外暴露*/
// 2.1. 字义 Schema(描述文档结构)

const userSchema = mongoose.Schema({
    username: {type:String, required:true},
    password: {type:String, required:true},
    type: {type:String, required:true},
    header: {type: String},
    post: {type: String},
    info: {type: String},
    company: {type: String},
    salary: {type: String},
})

// 2.2. 定义 Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user',userSchema)

// 2.3. 向外暴露 Model
exports.UserModel = UserModel

const chatSchema = mongoose.Schema({
    from: {type: String, required:true},
    to: {type: String, required: true},
    chat_id: {type: String, required:true},
    content: {type: String, required: true},
    read: {type: Boolean, default: false},
    create_time: {type: Number}
})

const ChatModel = mongoose.model('chat', chatSchema)
exports.ChatModel = ChatModel

