<template>
	<view class="content">
		<bgImg></bgImg>
		<view class="mainContainer">
			<view class="header title box" :style="'top:'+top+'rpx'">
				<!-- <button size="mini" @click="clear()">清空</button> -->
				<text>连接状态：{{status.connected?"已连接":"未连接"}}</text>
				<view class="title">服务器信息：{{broker}}</view>
				<!-- {{broker}} -->
				<!-- <button size="mini" @click="refresh()">刷新</button> -->
			</view>
			
			
			<view class="msg_box">
				<view v-for="item in msgs" class="msg_item">
					<view class="topic">
						{{item.topic}}
					</view>
					<view class="msg">
						{{item.msg}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="bottom box">
			<button class="btn btn-primary flex-2" @click="clear()">清空</button>
			<!-- <text>连接状态：{{status.connected?"已连接":"未连接"}}</text> -->
			<button class="btn btn-warning flex-2" @click="refresh()">刷新</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msgs:getApp().globalData.msgs,
				status:getApp().globalData.status,
				top:0,
				broker:getApp().globalData.broker
			}
		},
		mounted() {
			let windowinfo = uni.getWindowInfo()
			this.top=windowinfo.windowTop*2
			
		},
		onLoad() {
		
		},
		methods: {
			clear(){
				getApp().globalData.msgs.splice(0)
			},
			refresh(){
				if(getApp().globalData.msg_recieved){
					uni.showToast({
						title:"刷新成功！"
					})
				}else{
					uni.showToast({
						title:"没有数据！"
					})
				}
			}
		},
		computed:{
			
		},
		watch:{
			msgs(val,oldval){
				if(val.length>20)
					this.msgs.shift()
			}
		}
	}
</script>

<style lang="scss">
	.content{
		.mainContainer{
			padding: 10rpx;
			padding-top: 0px;
		}
		.box{
			width: 100%;
			padding: 5px;
			
		}
		.header{
			display: block;
			border: 1px solid #a66678;
			box-sizing: border-box;
			position: sticky;
			background-color: #ffffff;
		}
		.title{
			font-size: 20px;
			font-weight: 600;
			text-shadow: #afaf11 3px 3px 2px;
		}
		.bottom{
			display: flex;
			box-sizing: border-box;
			position: fixed;
			bottom:0;
			.flex-1{
				flex: 1;
			}
			.flex-2{
				flex: 2;
			}
		}
		.msg_box{
			// margin-top: 40px;
			border: 1px solid #afa178;
			padding: 5rpx;
			.msg_item{
				padding: 10rpx;
				border: 1px dotted #a66678;
				.topic{
					font-size: 30rpx;
					color: #afaf11;
				}
				.msg{
					font-size: 23rpx;
					color: #af8f11;
				}
			}
		}
	}
</style>
