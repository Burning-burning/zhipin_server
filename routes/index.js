//  注册路由

var express = require('express');
var router = express.Router();

const {UserModel, ChatModel} = require('../db/models')
const md5 = require('blueimp-md5')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册一个路由：用户注册
// 1. 获取请求参数
// 2. 处理
// 3. 返回响应数据
// router.post('/register', function(req, res, next){
//   const {username,password} = req.body
//   if(username==='admin'){
//     res.send({
//       code:1,
//       msg:'用户已存在'
//     })
//
//   }else{
//     res.send({
//       code:0,
//       data:{
//         _id: '123',
//         username,
//         password
//       }
//     })
//   }
// });



// 注册的路由
router.post('/register',function(req,res){
  //  请求读取参数
  const {username, password, type} = req.body

  // 处理
  // 判断用户是否存在， 如果存在，提示错误的信息，如果不存在，保存
  UserModel.findOne({username},function (error,user) {
    if(user){
      res.send({
        code: 1,
        msg: '用户已存在'
      })

    }else{
      new UserModel({username,  password: md5(password),type,}).save(function (error,doc) {
        // 持久化cookie，浏览器会保存在本地
        console.log(user)
        res.cookie('userid',doc._id,{maxAge:1000*60*60*24})

        const data = {username, type, _id: doc._id}
        res.send({
          code: 0, data })


      })
    }

  })


  // 返回响应数据

})


// 登陆的路由
router.post('/login',function (req,res) {
  const {username, password} = req.body
  // {password:0} 查询时过滤出指定的属性
  UserModel.findOne({username, password: md5(password)},{password:0},function(error,user){
    if(user){
      res.cookie('userid',user._id,{maxAge: 1000*60*60*24})

      res.send({
        code: 0,
        data: user

      })

    }else{
      res.send({
        code: 1,
        msg: '用户名或密码不正确'
      })

    }
  })

})


router.post('/update', function(req, res){
  const userid = req.cookies.userid
  if(!userid){
    return res.send({
      code:1,
      msg:'请先登录'
    })
  }
  const user = req.body
  UserModel.findByIdAndUpdate({_id:userid}, user, function(err, oldUser){
    if(!oldUser){
      res.clearCookie('userid')
      res.send({
        code: 1,
        msg: '请先登录'
      })

    }else{
      const {_id, username, type} = oldUser


      const data = Object.assign({_id, username, type}, user)
      res.send({
        code: 0,
        data
      })

    }
  })
})


router.get('/user', function(req,res){
  const userid = req.cookies.userid
  if(!userid){
    return res.send({
      code: 1,
      msg: '请登录'
    })
  }
  UserModel.findOne({_id: userid},{password: 0},function(error, user){
    res.send({
      code: 0,
      data: user
    })
  })
})



router.get('/list', function (req, res) {
  const {type} = req.query
  UserModel.find({type},{password:0},function (error, users) {
    res.send({
      code: 0,
      data: users
    })

  })

})

router.get('/msglist',function(req,res){
  const userid = req.cookies.userid
  UserModel.find(function(error, docs){
    const users = {}
    docs.forEach(doc=>{
      users[doc._id] = {username:doc.username, header: doc.header}
    })

    ChatModel.find('$or:'[{form: userid},{to: userid}],function (error, chatMsgs) {
      res.send({
        code: 0,
        data: {users, chatMsgs}
      })

    })
  })

})


router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from
  const to = req.cookies.userid
  /*
  更新数据库中的chat数据
  参数1: 查询条件
  参数2: 更新为指定的数据对象
  参数3: 是否1次更新多条, 默认只更新一条
  参数4: 更新完成的回调函数
   */
  ChatModel.updateOne({from, to}, {read: true}, {multi:true},function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})


module.exports = router;
