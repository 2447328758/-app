<template>
	<view class="">
		<view class="content">
			<bgImg></bgImg>
			<view class="container">
				<view class="title">
					<h2>骨关节病辅助检查系统</h2>
					<view class="line"></view>
				</view>
				
				<scroll-view scroll-y class="btns">
					<menuItem class="menuItem"  @click.native="clicked('devices')">用户信息</menuItem>
					<menuItem class="menuItem"  @click.native="clicked('canvas')">足底压力分布图</menuItem>
					<menuItem class="menuItem"  @click.native="clicked('chart')">足底压力统计曲线</menuItem>
					<menuItem class="menuItem"  @click.native="clicked('dataCompare')">前后对比</menuItem>
					<menuItem class="menuItem"  @click.native="clicked('index')">debug</menuItem>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	function navagateTo(url){
		// uni.switchTab({
		// 	url:url
		// })
		uni.navigateTo({
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
	.container{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		// margin-top: 50%;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translateY(-50%) translateX(-50%);
	}
	.title{
		// margin-top:200rpx;
		// margin-bottom: 30rpx;
		font-family: maobizi;
		opacity: 0.85;
		color: #3d3b8f;
	}
	.line{
		width: 80%;
		border: 1px solid #3d3b6f;
		margin: auto;
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
	.menuItem{
		width: 95%;
		height: 50px
	}
}
</style>
