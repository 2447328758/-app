<template>
	<view class="content">
		<button size="mini" @click="clear()">清空</button>
		<text>连接状态：{{status.connected?"已连接":"未连接"}}</text>
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
				status:getApp().globalData.status
			}
		},
		onLoad() {

		},
		methods: {
			clear(){
				getApp().globalData.msgs.splice(0)
			}
		},
		computed:{
		}
	}
</script>

<style lang="scss">
	.content{
		padding: 10rpx;
		.msg_box{
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
