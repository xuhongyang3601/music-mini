const express=require('express');
//引入body-parser中间件
const bodyParser=require('body-parser');
//引入用户路由器
const ur=require('./router/user.js');
const app=express();
app.listen(8080);
//把静态资源托管到public目录下
app.use( express.static('./public') );
//使用body-parser将post请求数据解析为对象
app.use( bodyParser.urlencoded({
 extended:false
}) );

//路由器（路由），放到当前服务器最后
//挂载路由器，添加前缀/user
app.use('/user',ur);

