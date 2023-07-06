import toast from "../uni_modules/uview-ui/libs/config/props/toast"

function toastSuccess(title){
	uni.showToast({
		title:title
	})
}
function toastError(title){
	uni.showToast({
		title:title,
		icon:"error",
	})
}
function toastLoading(title,dotask){
	uni.showLoading({
		title:title,
		mask:true
	})
	if(dotask)dotask()
}

export {toastSuccess, toastError, toastLoading}