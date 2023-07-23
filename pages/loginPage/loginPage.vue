<template>
	<view>
		<bgImg></bgImg>
		<view class="title">
			<h2>骨关节病辅助检查系统</h2>
			<h5 style="text-align: right;margin-right: 10%;">医生端</h5>
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
					    <span class="input-group-text">密码</span>
					  </div>
					  <textarea class="form-control" aria-label="With textarea" @input="oninputPwd" v-model="pwd"></textarea>
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
	function getPwd(pwd,mask){
		let password=""
		let j = 0
		for(let i in mask){
			if(mask[i]!='*'){
				password+=mask[i]
			}else{
				password+=pwd[j]
				j++
			}
		}
		return password
	}
	import { toastError, toastSuccess } from '../../unijs/unitoast'
	import {getDevices, saveDevices,genderDict,getUser} from "../../unijs/userCache.js"
	export default {
		data() {
			return {
				pwd:"",
				userinfo:{
					username:"",
					pwd:"",
				}
			};
		},
		methods:{
			oninputPwd(e){
				let pwd = e.detail.value
				this.userinfo.pwd=getPwd(this.userinfo.pwd,pwd)
				let mask = ""
				for(let i in pwd){
					mask+='*'
				}
				this.pwd=mask
				console.log(this.userinfo)
			}
			,
			login(){
				var that = this
				uni.request({
					url:"http://121.43.108.78:3307/doctor/login?uname="+this.userinfo.username+"&pwd="+this.userinfo.pwd,
					timeout:3000,
					success(res){
						// console.log(res)
						if(res.data.code===0){
							toastSuccess("登陆成功！")
							that.setDoctor(res.data.data)
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
			setDoctor(doctor){
				getApp().globalData.doctor=doctor
				console.log(doctor)
				uni.request({
					url:"http://121.43.108.78:3307/doctor/get?docid="+doctor.id,
					timeout:3000,
					success(res){
						console.log(res)
						
						if(res.data.code===0){
							let userset = res.data.data
							let users = []
							let t = getUser()
							t.did="_device"
							t.username="临时用户"
							t.age=0
							users.push(t)
							for(let i in userset){
								let user = userset[i]
								let user_t = getUser()
								user_t.uid=user.id
								
								user_t.did=user.device;
								user_t.username=user.name
								user_t.age=user.age
								if(user.sex=="男")user_t.gender="1"
								if(user.sex=="女")user_t.gender="0"
								users.push(user_t)
							}
							
							saveDevices(users)
							toastSuccess("获取患者成功！")
							setTimeout(()=>{
								uni.navigateTo({
									url:"/pages/indexpage/indexpage"
								})
							},1000)
							
						}else{
							toastError(res.data.msg)
						}
						
					},
					fail(res){
						console.log(res)
						toastError("获取患者失败！")
					}
				})
				
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
