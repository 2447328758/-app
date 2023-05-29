<template>
	<view class="content">
		<view class="form">
			<!-- value or swich type -->
			<view class="box type">
				<text class="label">类型</text>
				<uni-data-select :localdata="type_enmu" placeholder="请输入类型" v-model="type" @change="changeType"></uni-data-select>
			</view>
			<view class="box id">
				<text class="label">标识符</text>
				<uv-input placeholder="请输入id" @change="changeId"></uv-input>
			</view>
			<view class="box name">
				<text class="label">名称</text>
				<uv-input placeholder="请输入name" @change="changeName"></uv-input>
			</view>
			
			<view v-if="type=='value'">
			<view class="box unit">
				<text class="label">单位</text>
				<uv-input placeholder="请输入单位" @change="changeUnit"></uv-input>
			</view>
			<view class="box min"><text class="label">最小值</text><uni-number-box value="0" step="0.1" :min="min" :max="max" @change="changeMin"></uni-number-box></view>
			<view class="box max"><text class="label">最大值</text><uni-number-box value="0" step="0.1" :min="min" :max="max" @change="changeMax"></uni-number-box></view>
			</view>
			<view class="btn_submit">
				<button size="default" type="primary" @click="submit()">添加</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
					type_enmu:[{value:'value',text:"值类型"},{value:'switch',text:"开关类型"}],
					type:"",
					max:65535,
					min:-65534,
					model:{
				}
			};
		},
		methods:{
			submit(){
				let model = this.model
				if(this.type==""){
					uni.showToast({
						title:"type is required!",
						icon:'error',
						mask:true,
						duration:1000,
					})
					return
				}else if(!('id' in model)){
					uni.showToast({
						title:"id is required!",
						icon:'error',
						mask:true,
						duration:1000
					})
					return
				}else if(!('name' in model)){
					uni.showToast({
						title:"name is required!",
						icon:'error',
						mask:true,
						duration:1000
					})
					return
				}else if(this.type=='value'){
					if('max' in this.model&&'min' in this.model&&'unit' in this.model);
					else{
						uni.showToast({
							title:"max/min/单位 is required!",
							icon:'error',
							mask:true,
							duration:1000
						})
						return;
					}
					this.model.value=0
					getApp().globalData.value_model.push(this.model)
				}else if(this.type=='switch'){
					this.model.value=0;
					getApp().globalData.switch_model.push(this.model)
				}else{
					uni.showToast({
						title:"unkown err",
						icon:"error",
						mask:true,
						duration:1000,
					})
				}
				this.model={}
				console.log(this.model)
				uni.showToast({
					title:"添加成功！",
					duration:1000
				})				
			},
			changeType(e){
				if(this.type!=e)
					this.model={}
				// console.log(this.model)
			},
			changeId(e){
				// console.log(e)
				this.model.id=e
				// console.log(this.model)
			},
			changeName(e){
				// console.log(e)
				this.model.name=e
				// console.log(this.model)
			},
			changeUnit(e){
				// console.log(e)
				this.model.unit=e
				// console.log(this.model)
			},
			changeMax(e){
				// console.log(e)
				this.model.max=e
				// console.log(this.model)
			},
			changeMin(e){
				// console.log(e)
				this.model.min=e
				// console.log(this.model)
			}
		}
	}
</script>

<style lang="scss">
.content{
	padding: 20rpx;
	.form{
		margin: 10rpx;
		border: 2px solid #666688;
		border-radius:15rpx;
		padding: 22rpx;
	}
	.box{
		margin-bottom: 30rpx;
		padding: 8rpx;
		border: 2px dotted #8899aa;
		border-radius: 15rpx;
	}
	.btn_submit{
		margin: auto;
		width: 200rpx;
	}
	
}
</style>
