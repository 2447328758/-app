<template>
	<view class="content">
		<footpartial ref="footCanvas"></footpartial>
	</view>
</template>

<script>
	import footpartial from "@/components/footpartial/footpartial.vue"
	
	export default {
		onReady(){
		},
		components:{footpartial},
		data() {
			return {
				
			}
		},
		methods: {
			onClick(){
				
			}
		},
		onLoad(){
			let that = this
			uni.$on("updateFootView",(data)=>{
				console.log(data)
				that.$refs.footCanvas.update(data)
			})
		}
	}
</script>

<style>

</style>
