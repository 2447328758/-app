var deviceKey = "devices"
var genderDict={
	// "-1":"",
	"0":"女",
	"1":"男"
}
async function getDevices(){
	return await uni.getStorage({
		key:deviceKey
	})
}

function saveDevices(users){
	uni.setStorage({
		key:deviceKey,
		data:users
	})
}

function getUser(){
	return {
		did:"",
		username:"",
		gender:-1,
		weight:0
	}
}

export{getDevices, saveDevices,genderDict,getUser}