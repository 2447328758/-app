import crypto from "crypto"

//使用jwt进行登录
//app端推荐使用，因为app端需要多端同时登录
//clientid 和 username 建议随机产生避免重复
//用法:

let options = {
	username:"",
	clientId:"",
	password:"",
	
}



function getBytes(str){
	let a = []
    for(let i in str)
        a.push(str.codePointAt(i))
    return Uint8Array.from(a)
}
const secret = getBytes("token!@#$%^")

function replaceAll(s,char1,char2){
	let r = ""
	for(let i in s){
		if(s[i]==char1)
			r+=char2
		else
			r+=s[i]
	}
	return r
}

function base64Tobase64url(base64str){
	base64str = replaceAll(base64str,"=",'')
	base64str = replaceAll(base64str,"+","-")
	base64str = replaceAll(base64str,"/","_")
	// console.log(base64str)
    return base64str//.replaceAll('=','').replaceAll('+','-').replaceAll('/','_')
}

function getHeaderAndPayload(obj){
    let header = {alg:"HS256",typ:"JWT"}
    let payload = obj
    // payload.exp= Math.floor(Date.now()/1000)+12*3600
    // console.log(payload)
    let unCrypto =btoa(JSON.stringify(header))+"."+btoa(JSON.stringify(payload))
    // return unCrypto.substring(0,unCrypto.length-2)//除去尾部的两个'='，我也不知道为什么会有两个等号//replace 只会替换第一个匹配的字符
    return base64Tobase64url(unCrypto)
}


var hmac = crypto.createHmac("sha256", "token!@#$%^");

function sign(obj){

	let header = getHeaderAndPayload(obj)
	// console.log(header)
	let s = hmac.update(Buffer.from(header, 'utf-8')).digest("base64")
	let token=(header+"."+s)
	// return token.substring(0,token.length-1).replace('/','_')//去除尾部的两个个'='
	return base64Tobase64url(token)

//原因：
//base64编码结果中会有+、/、=三个特殊字符，它们在url中属于特殊字符是直接无法传递的；
// base64url其实就是把字符中的'+'和'/'分别替换成'-'和'_'，另外把末尾填充的‘=’去掉;其他都一样。
// https://blog.csdn.net/mijichui2153/article/details/116128452
}

export{sign}
