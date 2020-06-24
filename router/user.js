const express=require('express');
const r=express.Router();
const pool=require('../pool.js');

//用户注册
r.post('/reg',(req,res)=>{
 //2.验证数据是否为空
 let obj=req.body;
 if(!obj.uname){
  res.send({code:401,msg:'uname required'});
  return;
 }
 if(!obj.upwd){
   res.send({code:402,msg:'upwd required'});
  return
 }
 if(!obj.email){
   res.send({code:403,msg:'email required'});
  return
 }
  if(!obj.phone){
   res.send({code:404,msg:'phone required'});
   return
  }
 //1.获取post传递的数据
 //执行SQL语句
 pool.query('INSERT INTO xz_user SET ?',[obj],(err,result)=>{
	if(err)  throw err;
	console.log(result);
	//插入成功后相应
	res.send({code:200,msg:'sucess'});
	});
});
//用户登录
r.post('/login',(req,res)=>{
	let obj=req.body;
	if(!obj.uname){
	res.send({code:401,msg:'uname required'});
	return
 }
	if(!obj.upwd){
	res.send({code:402,msg:'upwd required'});
	return
 }
 pool.query('SELECT * FROM xz_user where uname=? and upwd=?',[obj.uname,obj.upwd],(err,result)=>{
	if(err)  throw err;
	//结果是数组
    // console.log(result);
	//如果数组长度为0，说明登陆失败,否则登陆成功
	if(result.length===0){
		res.send({code:301,msg:'login err'});
		return
  }
  res.send({code:200,msg:'success'});
  if(err)  throw err; 
  if(result.length===0){
    res.send({code:301,msg:'err'});
  }else{
    res.send({code:200,msg:'sucess'});
  }
 });
});
//用户修改
r.get('/update',(req,res)=>{
  //获取查询字符串传递的数据
  let obj=req.query
  //使用for-in循环查询遍历对象属性，如果哪一项的值为空，响应哪一项是必须的
  //访问每一个对象
  let n=400;
  for(let i in obj){
    //i 属性名    obj[i]对应的属性值
	//判断属性值是否为空
	n++;
	if(obj[i]===''){
	res.send({code:n,msg:i+'required'});
	return
	}
  }
  pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],(err,result)=>{
   if(err)  throw err;
    //返回的结果是对象，如果对象的affectedRows属性值为0，说明修改失败，否则修改成功
	if(result.affectedRows===0){
	 res.send({code:301,msg:'err'});
	}else{
	res.send({code:200,msg:'success'});
	}
  });
});
//用户列表
//get   /list
r.get('/list',(req,res)=>{
  //获取查询字符串传递的数据
  let obj=req.query
  //如果页码为空默认为1
  if(obj.page<1 || obj.page==='')  obj.page=1;
   //如果每页的数据量为空或者负值，默认为3
  if(obj.sum<1 || obj.sum==='')  obj.sum=3;
  //输入的数字必须是数字
  if(isNaN(parseInt(obj.page))){
   res.send('不合法')
    return
  }
  if(isNaN(parseInt(obj.sum))){
   res.send('不合法')
   return
  }
   //执行SQL语句
  pool.query('SELECT * FROM xz_user limit ?,?',[parseInt((obj.page-1)*obj.sum),parseInt(obj.sum)],(err,result)=>{
  if(err)  throw err
  //响应给浏览器端
  res.send(result)
  });
});
//删除用户
//get  /delete
r.get('/delete',(req,res)=>{
  //获取查询字符串传递的数据
  let obj=req.query;
  //判断是否为空
  if(!obj.uid){
  res.send({code:401,msg:'uid required'})
  return
  }
  //执行SQL语句
  pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],(err,result)=>{
   if(err)  throw err
   //返回对象，如果对象下的affectRows为0删除失败，否则删除成功
   if(result.affectedRows===0){
    res.send({code:301,msg:'err'})
   }else{
	res.send({code:200,msg:'suc'})
	}
  });
});


//导出路由器对象
module.exports=r