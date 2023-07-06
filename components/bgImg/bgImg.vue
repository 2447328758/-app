<template>
	<view>
		<image src="../../static/pics/index.png" class="bg-img"></image>
	</view>
</template>

<script>
	export default {
		name:"bgImg"
	}
</script>

<style lang="scss">
.bg-img{
		position: fixed;
		width:100%;
		height:100%;
		top:0;
		left: 0;
		z-index: -1;
		opacity: 0.75;
	}
</style>