import toast from "../uni_modules/uview-ui/libs/config/props/toast"

function toastSuccess(title){
	uni.showToast({
		title:title
	})
}
function toastError(title,dotask){
	uni.showToast({
		title:title,
		icon:"error",
		duration:2500,
		complete() {
			if(dotask)setTimeout(dotask,2000)
		}
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