<template>
	<view>
		<bgImg></bgImg>
		<view class="title">
			<h2>骨关节病辅助检查系统</h2>
			<h5 style="text-align: right;margin-right: 10%;">用户端</h5>
			<view class="line"></view>
		</view>
		<view class="body">
			<div class="form" style="width: 100%;">
				<div class="form-group">
					<div class="input-group">
					  <div class="input-group-prepend">
					    <span class="input-group-text">用户名</span>
					  </div>
					  <textarea class="form-control" aria-label="With textarea" v-model="userinfo.username"></textarea>
					</div>
				</div>
				<div class="form-group">
					<div class="input-group">
					  <div class="input-group-prepend">
					    <span class="input-group-text">手机号</span>
					  </div>
					  <textarea class="form-control" aria-label="With textarea" v-model="userinfo.phone"></textarea>
					</div>
				</div>
				<div class="form-group">
					<div class="input-group">
					  <div class="input-group-prepend">
					    <span class="input-group-text">设备号</span>
					  </div>
					  <textarea class="form-control" aria-label="With textarea" v-model="userinfo.did"></textarea>
					</div>
				</div>
			
				<div class="btn_group">
					<button @click="login" class="btn btn-primary btn_login" type="button">登录</button>
				</div>
			</div>
		</view>
	</view>
</template>

<script>
	import { toastError, toastSuccess } from '../../unijs/unitoast'
	import {getDevices, saveDevices,genderDict,getUser} from "../../unijs/userCache.js"
	export default {
		data() {
			return {
				userinfo:{
					username:"",
					phone:"",
					did:""
				}
			};
		},
		methods:{
			login(){
				var that = this
				uni.request({
					url:"http://121.43.108.78:3307/user/login?uname="+this.userinfo.username+"&phone="+this.userinfo.phone+"&clientid="+this.userinfo.did,
					timeout:3000,
					success(res){
						console.log(res)
						if(res.data.code===0){
							that.setUser(res.data.data)
							toastSuccess("登陆成功！")
							uni.navigateTo({
								url:"/pages/indexpage/indexpage"
							})
						}else{
							toastError(res.data.msg)
						}
						
					},
					fail(res){
						console.log(res)
						toastError("登陆失败！")
					}
				})
			},
			setUser(user){
				getApp().globalData.user=user
				console.log(user)
				getApp().globalData.currentUser.did=user.device
				getApp().globalData.currentUser.username=user.name
				if(user.sex=="女")getApp().globalData.currentUser.gender="0"
				if(user.sex=="男")getApp().globalData.currentUser.gender="1"
				getApp().globalData.deviceid=user.device
				console.log(getApp().globalData.currentUser)
				console.log(getApp().globalData.deviceid)
				
				let oldid = getApp().globalData.deviceid
				getApp().globalData.client.unsubscribe("post/foot/"+oldid)
				getApp().globalData.deviceid=user.device
				// getApp().globalData.client.subscribe("post/foot/"+this.users[index].did)
				getApp().globalData.client.subscribe("post/foot/"+user.device+"/#")
			}
		}
	}
</script>

<style lang="scss">
.title{
	// margin-top:200rpx;
	// margin-bottom: 30rpx;
	font-family: maobizi;
	opacity: 0.85;
	text-align: center;
	color: #3d3b8f;
	margin-top: 20vh;
}
.line{
		width: 80%;
		border: 1px solid #3d3b6f;
		margin: auto;
	}
.body{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 80%;
	// height: %;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%);
	.btn_group{
		display: flex;
		.btn_login{
			margin: auto;
		}
	}
	
}

</style>
