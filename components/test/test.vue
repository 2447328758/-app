<template>
	<view>
		<view class="value">
			{{value}}
		</view>
	</view>
</template>

<script>
	export default {
		name:"test",
		data() {
			return {
				value:0
			};
		},
		methods:{
			set(val){
				this.value=val
			}
		}
	}
</script>

<style lang="scss">
.value{
	width: 40px;
	height: 40px;
	border: 1px solid black;
	margin: 5px;
}
</style>