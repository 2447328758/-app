<template>
	<view class="out">
		<bgImg></bgImg>
		<div class="form">
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
				    <span class="input-group-text">性别</span>
				  </div>
				  <!-- <select class="custom-select" id="gender" v-model="userinfo.gender">
				      <option value="1">男</option>
				      <option value="0">女</option>
				    </select> -->
					<!-- <textarea class="form-control" readonly disabled @click="chooseGender" v-model="genderDict[userinfo.gender]"></textarea> -->
					<radio-group class="genderGroup" name="gender" @change="genderChanged">
						<label class="genderItem">
							<radio :value="'1'" :checked="userinfo.gender=='1'"/><text>男</text>
						</label>
						<label class="genderItem">
							<radio :value="'0'" :checked="userinfo.gender=='0'"/><text>女</text>
						</label>
					</radio-group>
				</div>
			</div>
			<div class="form-group">
				<div class="input-group">
				  <div class="input-group-prepend">
				    <span class="input-group-text">年龄</span>
				  </div>
				  <!-- <textarea class="form-control" aria-label="With textarea" v-model="addid"></textarea> -->
				  <input class="form-control" type="number" v-model="userinfo.age"/>
				  <div class="input-group-append">
				      <span class="input-group-text">岁</span>
				    </div>
				</div>
			</div>
			<div class="form-group">
				<div class="input-group">
				  <div class="input-group-prepend">
				    <span class="input-group-text">设备id</span>
				  </div>
				  <textarea class="form-control" aria-label="With textarea" v-model="userinfo.did"></textarea>
				</div>
				
				<!-- <small id="deviceidHelp" class="form-text text-muted">为了更好地提供服务</small> -->
				<small id="deviceidHelp" class="form-text text-muted">包装标签上写有设备id,如果数据未正常显示请检查设备id是否输入正确</small>
			</div>

			<div class="btn_group">
				<!-- <button @click="add" class="btn btn-outline-primary btn_add" type="button">保存</button> -->
				<!-- <button @click="add" class="btn btn-outline-primary btn_add" type="button">编辑</button> -->
				<button @click="add" class="btn btn-outline-primary btn_add" type="button">添加</button>
			</div>
		</div>
		
		<table class="table table-striped table-bordered devices">
			<thead>
				<tr>
					<th scope="col" width="">用户名</th>
					<th scope="col" width="">性别</th>
					<th scope="col" width="">年龄</th>
					<th scope="col" width="">设备Id</th>
					<th scope="col" width="">操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="u,i in users" :class="{choosed:u.did==did}" :key="u.did">
					<td>{{u.username}}</td>
					<td>{{genderDict[u.gender]}}</td>
					<td>{{u.age}}岁</td>
					<td>{{u.did}}</td>
					<td>
						<div class="btn-group-sm btn-group-vertical">
							<button @click="choose(i)" class="btn btn_oper btn-outline-primary btn-sm" style="width: 46px;">设置</button>
							<button @click="edit(i)" class="btn btn_oper btn-outline-warning btn-sm" style="width: 46px;">编辑</button>								
						</div>
					</td>
				</tr>
			</tbody>
		</table>
		<!-- 弹出层 -->
		<uni-popup ref="popup" type="bottom">
			<view class="dialog">
				<!-- <button @click="closeDialog" class="btn btn-sm btn-danger closeDialog">关闭</button> -->
				<button type="button" class="btn-sm d-inline btn-danger" aria-label="关闭" style="margin-left: 90%;" @click="closeDialog">
				  <span aria-hidden="true">&times;</span>
				</button>
				<h3 class="title">更改信息</h3>
				<div class="form">
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
						    <span class="input-group-text">性别</span>
						  </div>
						  <!-- <select class="custom-select" id="gender" v-model="userinfo.gender">
						      <option value="1">男</option>
						      <option value="0">女</option>
						    </select> -->
							 <radio-group class="genderGroup"  name="gender" @change="genderChanged">
							 	<label class="genderItem">
							 		<radio :value="'1'" :checked="userinfo.gender=='1'"/><text>男</text>
							 	</label>
							 	<label class="genderItem">
							 		<radio :value="'0'" :checked="userinfo.gender=='0'"/><text>女</text>
							 	</label>
							 </radio-group>
						</div>
					</div>
					<div class="form-group">
						<div class="input-group">
						  <div class="input-group-prepend">
						    <span class="input-group-text">年龄</span>
						  </div>
						  <!-- <textarea class="form-control" aria-label="With textarea" v-model="addid"></textarea> -->
						  <input class="form-control" type="number" v-model="userinfo.age"/>
						  <div class="input-group-append">
						      <span class="input-group-text">岁</span>
						    </div>
						</div>
					</div>
					<div class="form-group">
						<div class="input-group">
						  <div class="input-group-prepend">
						    <span class="input-group-text">设备id</span>
						  </div>
						  <textarea class="form-control" aria-label="With textarea" v-model="userinfo.did"></textarea>
						</div>
						
						<!-- <small id="deviceidHelp" class="form-text text-muted">为了更好地提供服务</small> -->
						<small id="deviceidHelp" class="form-text text-muted">包装标签上写有设备id,如果数据未正常显示请检查设备id是否输入正确</small>
					</div>
				
					<div class="btn_group">
						<!-- <button @click="add" class="btn btn-outline-primary btn_add" type="button">保存</button> -->
						<!-- <button @click="add" class="btn btn-outline-primary btn_add" type="button">编辑</button> -->
						<button @click="add" class="btn btn-outline-primary btn_add" type="button">保存</button>
						<button @click="del" class="btn btn-outline-warning btn_add" >删除</button>
					
					</div>
				</div>
			</view>
			
		</uni-popup>
		
	</view>
		
</template>

<script>
	import { toastError, toastSuccess } from '../../unijs/unitoast'
	import {getDevices, saveDevices,genderDict} from "../../unijs/userCache.js"
	import { v4 as uuidv4 } from 'uuid';
	function notNullOrEmpty(value,name){
		if(value==""||value==-1||value==undefined||value==[]||value==null||value==NaN||value=={})
		{
			toastError("请输入正确的"+name+"!")
			return true
		}
		return false
	}
	function notZero(value,name){
		if(value=="0"||value==0)
		{
			toastError("请输入正确的"+name+"!")
			return true
		}
		return false
	}
	var defaultUserInfo={
					did:"",
					username:"",
					gender:-1,
					weight:0,
					age:20
				}
	export default {
		data() {
			return {
				addid:"",
				userinfo:{
					did:"",
					username:"",
					gender:-1,
					weight:0,
					age:20
				},
				users:[
					
				],
				did:"",
				genderDict:genderDict,
				editIndex:-1
			};
		},
		methods:{
			add(){
				// if(this.addid=='' ){
				// 	uni.showToast({
				// 		title:"请输入正确的id！",
				// 		icon:"error"
				// 	})
				// 	return;
				// }
				toastError("请在电脑端添加")
				return
				let userinfo = {
					username:this.userinfo.username,
					gender:this.userinfo.gender,
					weight:Number(this.userinfo.weight),
					did:this.userinfo.did,
					uid:this.userinfo.uid,
					age:this.userinfo.age
				}
				
				if(!userinfo.uid)userinfo.uid=uuidv4()
				console.log(userinfo)
				// console.log(this.users.filter(e=>e.did=userinfo.did))
				let illegle = false
				if(
					notNullOrEmpty(userinfo.username,"用户名")
					||notNullOrEmpty(userinfo.gender,"性别")
					||notNullOrEmpty(userinfo.weight,"体重")
					||notZero(userinfo.weight,"体重")
					||notNullOrEmpty(userinfo.did,"设备id")
				)return
				// console.log(userinfo)
				// this.users.push({"did":this.addid})
				
				let index = this.editIndex
				if(index!=-1){
					let uid = this.users[index].uid
					this.users[index]=userinfo
					this.editIndex=-1
					toastSuccess("更改成功！")
					if(uid==getApp().globalData.currentUser.uid){
						getApp().globalData.currentUser=this.users[index]
						this.choose(index)
					}
				}else{
					if(this.users.filter(e=>e.did==userinfo.did).length!=0){
						toastError("不能重复添加相同的id！")
						return
					}
					this.users.push(userinfo)
					toastSuccess("添加成功！")
				}
				saveDevices(this.users)
			},
			choose(index){
				let oldid = getApp().globalData.deviceid
				getApp().globalData.client.unsubscribe("post/foot/"+oldid+"/#")
				getApp().globalData.deviceid=this.users[index].did
				// getApp().globalData.client.subscribe("post/foot/"+this.users[index].did)
				getApp().globalData.client.subscribe("post/foot/"+this.users[index].did+"/#")
				getApp().globalData.currentUser = this.users[index]
				console.log(getApp().globalData.currentUser)
				uni.showToast({
					title:"设置成功！"
				})			
			},
			del(index){
				if(typeof index != 'number' && this.editIndex!=-1){
					this.del(this.editIndex)
					this.editIndex=-1
					this.closeDialog()
					return
				}
				getApp().globalData.client.unsubscribe("post/foot/"+this.users[index].did)
				this.users.splice(index,1)
				saveDevices(this.users)
			},
			edit(index){
				
				toastError("请在电脑端编辑")
				return
				this.$refs.popup.open('dialog')
				this.userinfo=this.users[index]
				this.editIndex=index
				// this.users.splice(index,1)
				// this.add(index)
			},
			genderChanged(e){
				this.userinfo.gender=e.detail.value
			},
			closeDialog(){
				this.$refs.popup.close()
				this.editIndex=-1
				this.userinfo=defaultUserInfo
			}
		},
		onLoad(){
			this.did=getApp().globalData.deviceid
			getDevices().then(res=>{
				if(typeof res.data === 'object')
					this.users=res.data
				else
					this.users=[]
			})
			
		}
	}
</script>

<style lang="scss">
.out{
	padding: 6px;
	// .btn_add{
	// 	// margin-left: 80%;
	// 	margin: 15px;
	// }
	.devices{
		text-align: center;
	}
	.choosed{
		background-color: rgba(40,40,255,0.6);
	}
	.btn_oper{
		margin: 3px 5px;
	}
	.btn_group{
		margin: 10px auto;
		display: flex;
		.btn_add{
			display: inline-block;
			margin:auto;
		}
	}
}
.dialog{
	margin: 20px;
	padding: 15px;
	box-sizing: border-box;
	background-color: white;
	border-radius: 10px;
	.title{
		text-align: center;
	}
	.closeDialog{
		margin-left: 80%;
	}
}

.genderGroup{
	flex: 1;
	display: flex;
	border: 1px solid rgb(206, 212, 218);
	border-radius: 0 3px 3px 0;
	color: rgb(73, 80, 87);
	.genderItem{
		display: inline-block;
		margin: 5px auto;
	}
}
</style>
