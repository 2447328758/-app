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

export{getDevices, saveDevices,genderDict}