<template>
	<view class="content">
		<view class="data_wrap">
			<view v-for="(item,index) in globalData.value_model" :key="index" class="data_box">
			<zai-lattice  class="data" shadow 
		    progressColor='#ffffff' 
		    :progressPercent='(item.value-item.min)*100/(item.max-item.min)'
		    :title='item.name' 
		    :num='item.value' 
		    :unit='item.unit'
			:type='item.type'
			:src='item.path'
			:size='30'
			@click="sendCmd(item.id,'value',item.name)"
			/>
			</view>
		</view>
		<view class="switch_wrap">
			<view class="switch_box" v-for="(item,index) in globalData.switch_model" :key="index">
				<text class="label">{{item.name}}</text>
				<switch class="switch" :checked="item.value===1" @change="switchChanged($event,item.id)"></switch>
			</view>
		</view>
		
		
		<wm-list-add @clickAdd="add()"></wm-list-add>
	</view>
</template>

<script>
	import zaiLattice from "../../components/zai-lattice";
	export default {
		onLaunch(e) {
			// console.log("back",e);
		},
		data() {
			return {
				// value_model:getApp().globalData.value_model,
				// switch_model:getApp().globalData.switch_model,
				globalData:getApp().globalData
			};
		},
		components:{
			zaiLattice
		},
		methods:{
			add(){
				uni.showToast({
					title:"点击了add"
				})
				uni.navigateTo({
					url:"/pages/addModel/addModel"
				})
			},
			sendCmd(id,type,value){
				let errcallback=(err)=>{
									if(err) uni.showToast({
										icon:"error",
										content:err
									})
									else
										uni.showToast({
											title:"操作成功！",
											duration:500
										})
								}
				if(type=='value'){
					uni.showModal({
						title:value,
						editable:true,
						placeholderText:"请输入值",
						success: (e) => {
							// console.log(e)
							if(e.confirm){
								getApp().globalData.client.publish('set',JSON.stringify({
									id:id,
									value:Number(e.content)
								}),{},
								errcallback)
							}else{
								uni.showToast({
									title:"用户取消"
								})
							}
						}
					})
				}else if( type=='switch'){
					getApp().globalData.client.publish('set',JSON.stringify({
						id:id,
						value:value
					}),{},
					errcallback)
				}
			},
			switchChanged(e,id){
				console.log(e,id)
				this.sendCmd(id,"switch", e.detail.value?1:0)
			}
		}
		
		
	
	}
</script>

<style lang="scss">
.content{
	padding: 15rpx;
	.data_wrap{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.data_box{
			display: inline-block;
			margin: 20rpx;
			width: 300rpx;
		}
	}
	.switch_wrap{
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content:start;
		.switch_box{
			.label{
				margin: 5rpx;
				font-size: 14rpx;
			}
			.switch{
				margin: 10rpx;
			}
		}
	}
}
</style>
