<template>
	<view class="content">
		<bgImg></bgImg>
		<view class="header" :style="'top:'+top+'rpx'">
			<button size="mini" @click="clear()">清空</button>
			<text>连接状态：{{status.connected?"已连接":"未连接"}}</text>
			{{broker}}
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
		padding: 10rpx;
		padding-top: 0px;
		.header{
			display: block;
			position: sticky;
			width: 100%;
			background-color: #ffffff;
			box-sizing: border-box;
			border: 1px solid #a66678;
			padding: 5px;
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
