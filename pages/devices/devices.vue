<template>
	<view class="out">
		<bgImg></bgImg>
		<div class="form-group">
			<div class="input-group">
			  <div class="input-group-prepend">
			    <span class="input-group-text">设备id</span>
			  </div>
			  <textarea class="form-control" aria-label="With textarea" v-model="addid"></textarea>
			</div>
			<!-- <small id="deviceidHelp" class="form-text text-muted">为了更好地提供服务</small> -->
			<small id="deviceidHelp" class="form-text text-muted">包装标签上写有设备id,如果数据未正常显示请检查设备id是否输入正确</small>
			<button @click="add" class="btn btn-outline-primary addbtn">添加</button>
		</div>
		<table class="table table-striped table-bordered devices">
			<thead>
				<tr>
					<th scope="col" width="30%">设备id</th>
					<th scope="col" width="40%">操作</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="u,i in users" :class="{choosed:u.did==did}" :key="u.did">
					<td>{{u.did}}</td>
					<td>
						<button @click="choose(i)" class="btn btn_oper btn-outline-primary btn-sm" style="width: 46px;">设置</button>
						<button @click="del(i)" class="btn btn_oper btn-outline-danger btn-sm" style="width: 46px;">删除</button>
					</td>
				</tr>
			</tbody>
		</table>
	</view>
</template>

<script>
	var deviceKey = "devices"
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
	export default {
		data() {
			return {
				addid:"",
				users:[
					
				],
				did:""
			};
		},
		methods:{
			add(){
				if(this.addid=='' ){
					uni.showToast({
						title:"请输入正确的id！",
						icon:"error"
					})
					return;
				}
					
				this.users.push({"did":this.addid})
				saveDevices(this.users)
			},
			choose(index){
				let oldid = getApp().globalData.deviceid
				getApp().globalData.client.unsubscribe("post/foot/"+oldid)
				getApp().globalData.deviceid=this.users[index].did
				getApp().globalData.client.subscribe("post/foot/"+this.users[index].did)
				getApp().globalData.client.subscribe("post/foot/"+this.users[index].did+"/#")
				uni.showToast({
					title:"设置成功！"
				})			
			},
			del(index){
				getApp().globalData.client.unsubscribe("post/foot/"+this.users[index].did)
				this.users.splice(index,1)
				saveDevices(this.users)
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
	.addbtn{
		margin-left: 80%;
	}
	.devices{
		text-align: center;
	}
	.choosed{
		background-color: rgba(40,40,255,0.6);
	}
	.btn_oper{
		margin: 0 5px;
	}
}
</style>
