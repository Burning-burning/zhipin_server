const  md5 = require("blueimp-md5")

// 测试使用mongoose数据库操作mongodb数据库

// 1. 连接数据库
// 1.1. 引入 mongoose
const mongoose = require('mongoose')


// 1.2. 连接指定数据库(URL 只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected',function(){
    console.log("连接数据库成功，YE！！！")
})
// 2. 得到对应特定集合的 Model
// 2.1. 字义 Schema(描述文档结构)
const userSchema = mongoose.Schema({
    username: {type: String, require:true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    header: {type: String}
})
// 2.2. 定义 Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('user',userSchema)  //集合名：users

// 3. 通过 Model 或其实例对集合数据进行 CRUD 操作
// 3.1. 通过 Model 实例的 save()添加数据
function testSave(){
    const userModel = new UserModel({username: 'Bob', password: md5("456"), type:'laoban'})

    userModel.save(function (error, user) {
        console.log("save()",error,user)
    })
}
// testSave()



// 3.2. 通过 Model 的 find()/findOne()查询多个或一个数据
function testFind() {
    UserModel.find(function (error, users) {
        console.log("find()",error,users)
    })

    UserModel.findOne({_id: '5ed1286c2b5c5672ca44f89f'}, function (error,user) {
        console.log("findOne()",error,user)
    })

}
// testFind()



// 3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据
function testUpdate(){
    UserModel.findByIdAndUpdate({_id: '5ed1286c2b5c5672ca44f89f'},{username: 'Jack'}, function(error, oldUser){
        console.log("update",error,oldUser)
    })

}
// testUpdate()
// 3.4. 通过 Model 的 remove()删除匹配的数据
function testRemove(){
    UserModel.deleteOne({_id: '5ed1286c2b5c5672ca44f89f'},function(error, doc){
        console.log("remove",error,doc)
    })

}
testRemove()