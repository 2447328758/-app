<template>
	<view class="">
		<view class="content">
			<bgImg></bgImg>
			<view class="title">
				<h1>智能鞋垫辅助系统</h1>
			</view>
			<view class="line"></view>
			<scroll-view scroll-y class="btns">
				<menuItem :icon="'../../static/icon/info.png'" @click.native="clicked('devices')">设备绑定</menuItem>
				<menuItem :icon="'../../static/icon/temp.png'" @click.native="clicked('canvas')">鞋垫可视化</menuItem>
				<menuItem :icon="'../../static/icon/smoke.png'" @click.native="clicked('canvas')">时间曲线</menuItem>
				<menuItem :icon="'../../static/icon/chart.png'" @click.native="clicked('index')">debug</menuItem>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	function navagateTo(url){
		uni.switchTab({
			url:url
		})
	}
	import {toastSuccess, toastError, toastLoading} from "../../unijs/unitoast"
	export default {
		data() {
			return {
				globalData:getApp().globalData,
			};
		},
		methods:{
			clicked(choice){
				console.log(choice)
				navagateTo("/pages/"+choice+"/"+choice)	
			}
		}
	}
</script>

<style lang="scss">
@font-face {
	font-family: "maobizi";
	src: url(../../static/font/ZhengQingKeLengKuTi-2.ttf);
}
.content{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	.title{
		margin-top: 200rpx;
		font-family: maobizi;
		opacity: 0.85;
		color: #3d3b8f;
	}
	.line{
		width: 70%;
		border: 1px solid #3d3b6f;
	}
	.btns{
		margin-top: 60rpx;
		display: flexbox;
		flex-direction: row;
		flex-wrap: wrap;
		width: 80%;
		height: 700rpx;
		border: 2px solid rgba(0,0,0,0.6);
		border-radius: 30rpx;
		background-color: rgba(200, 200, 200, 0.3);
	}
}
</style>
