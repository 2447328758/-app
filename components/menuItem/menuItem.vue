<template>
	<view class="out">
		<image class="icon" :src="icon"></image>
		<view class="text"><slot></slot></view>
	</view>
</template>

<script>
	export default {
		name:"menuItem",
		props:{
			"icon":{
				type:String
			}
		}
	}
</script>

<style lang="scss">
@font-face {
	font-family: "maobizi";
	src: url(../../static/font/ZhengQingKeLengKuTi-2.ttf);
}
.out{
	box-sizing: border-box;
	background-color: rgba(150,150,150,0.4);
	padding: 6px;
	margin: 6px;
	border: 1px solid rgba(0,0,0,0.5);
	border-radius: 10px;
	width: 45%;
	display: inline-flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	.icon{
		display: inline-block;
		width:50px;
		height: 50px;
	}
	.text{
		display: inline-block;
		font-family: maobizi;
		font-weight: 100;
	}
}
</style>