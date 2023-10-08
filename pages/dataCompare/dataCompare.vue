<template>
	<view class="">
		<view class="content">
			<view class="item">
				<view class="container">
					<view class="row">
						<footpartial :size="sizeRate" :show_click_point="false" :key="1" :canvasId="'nowCanvas'" ref="nowCanvas" ></footpartial>
					</view>
					<view class="row" style="text-align: center;display: block;">
						当前(单位：N)
					</view>
				</view>
			</view>
			<view class="item">
				<view class="container">
					<view class="row">
						<footpartial :size="sizeRate" :show_click_point="false" :key="2" :canvasId="'beforeCanvas'" ref="beforeCanvas"></footpartial>
					</view>
					<view class="row" style="text-align: center;display: block;">
						上次情况(单位：N)
					</view>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import {toastSuccess, toastError, toastLoading} from "../../unijs/unitoast.js"
	import {InfluxQuery} from "../../unijs/influx_query.js"
	const opt_influx = getApp().globalData.opt_influxdb
	const influx_query=new InfluxQuery(opt_influx.url, opt_influx.token, opt_influx.org, opt_influx.bucket)
	function handleData(data){
		let f = (datetime)=>{
			let date = datetime.split(" ")[0]
			let time = datetime.split(" ")[1]
			date = date.split("-")
			time = time.split(":")
			return new Date(date[0],date[1]-1,date[2],time[0],time[1],time[2])
		}
		let start = f(data.start)
		let end = f(data.end)
		let device_id = data.deviceId
		return {
			timeRange:[start,end],
			device_id:device_id
		}
	}
	async function getLastTimeRange(){

		let res = await uni.request({
			url:"http://121.43.108.78:1001/timeRecorder/getLast?user_id="+getApp().globalData.currentUser.user_id,
			header:{
				"Authorization":`jwt ${getApp().globalData.doctor.jwt}`,
				"Referer":"http://121.43.108.78:1001/"
			},
			timeout:5000
		})
		return handleData(res.data.data)
	}
	export default {
		data() {
			return {
				sizeRate:0.5,
				lastInfo:undefined
			};
		},
		mounted() {
			
			if(!getApp().globalData.currentUser.user_id){
				toastError("请先选择用户！",()=>{
					uni.navigateTo({
						url:"/pages/devices/devices"
					})
				})
				return
			}else if(!getApp().globalData.doctor.jwt){
				toastError("请先登录！",()=>{
					uni.navigateTo({
						url:"/pages/loginPage/loginPage"
					})
				})
				return
			}
			uni.$on("updateFootView",(data)=>{
				this.$refs.nowCanvas.update(data)
			})
		},
		onLoad() {
			getLastTimeRange().then((res)=>{
				this.lastInfo=res
				this.getLastData()
			})
		},
		methods:{
			getLastData(){
				
				console.log(this.lastInfo.timeRange[0].getTime(),this.lastInfo.timeRange[1].getTime())
				influx_query.queryWithFlux(
				`
				from(bucket: "foot")
				  |> range(start: ${this.lastInfo.timeRange[0].getTime()*1000000}, stop: ${this.lastInfo.timeRange[1].getTime()*1000000})
				  |> filter(fn: (r) => r["_measurement"] == "data")
				  |> filter(fn: (r) => r["_field"] == "value")
				  |> filter(fn: (r) => r["client_id"] == "${this.lastInfo.device_id}")
				  |>mean()
				  |> yield(name: "mean")
				`
				).then((res)=>{
					// console.log(res)
					let data = {}
					let i_value=res[0].findIndex((value)=>value==='_value')
					let i_id=res[0].findIndex((value)=>value==='id')
					for(let i=1;i<res.length;i++){
						let id =Number(res[i][i_id])
						if(id>0&&id<=36)data[id]=Number(res[i][i_value]).toFixed(0)
					}
					// console.log(data)
					
					
					this.$refs.beforeCanvas.update(data)
				})
			}
		}
	}
</script>

<style lang="scss">
.content{
	display: flex;
	flex-direction: row;
	justify-content: center;
	.row{
		font-size: $uni-font-size-lg;
		color: $uni-color-primary;
	}
}
</style>
