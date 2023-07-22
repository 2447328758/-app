<template>
	<view>
		<bgImg></bgImg>
		<view class="userinfo">
			<ul class="list-group">
			  <li class="list-group-item">用户名：{{userinfo.username}}</li>
			  <li class="list-group-item">性别：{{genderDict[userinfo.gender]}}</li>
			  <!-- <li class="list-group-item">体重：{{userinfo.weight}}kg</li> -->
			  <li class="list-group-item">年龄：{{userinfo.age}}岁</li>
			  <li class="list-group-item">设备Id：{{userinfo.did}}</li>
			  <!-- <li class="list-group-item">And a fifth one</li> -->
			</ul>
		</view>
		
		<!-- 压力值图表 -->
		<view class="chart">
			<view class="chart_title keji">
				<text>------双脚压力差------</text>
				<br/>
				<button @click="getServerData()">刷新</button>
				<view class="u-notice-bar keji badge-danger" :style="{display:show_nothing?'block':'none',fontSize:'16px',color:'orange'}">
					没有数据
				</view>
			</view>
			<qiun-data-charts
			v-if="show_chart"
			type="line"
			:opts="opts"
			:chartData="chartData"
			:ontouch="true"
			/>
		</view>
		<view class="log keji">
			<text class="badge-info badge" style="font-size: 25px;">建议</text>
			<view class="judge one">
				<text class="badge badge-dark">左脚</text>
				<br/>
				<text class="advice" v-if="!judge">{{"无建议"}}</text>
				<view v-if="judge">
					<view class="advice"  v-for="d in judge.left.diagnostic">
						您有<span :style="d.percent>=50?'color:red;':'color:orangered;'" >{{d.percent}}%</span>的概率患有<span style="color: red;">{{d.diease.name}}</span>
					</view>
				</view>
			</view>
			<view class="judge one">
				<text class="badge badge-dark">右脚</text>
				<br/>
				<!-- <text class="advice">{{judge?judge.right.advices:"无建议"}}</text> -->
				<text class="advice" v-if="!judge">{{"无建议"}}</text>
				<view v-if="judge">
					<view class="advice" v-if="judge" v-for="d in judge.right.diagnostic">
						您有<span :style="d.percent>=50?'color:red;':'color:orangered;'" >{{d.percent}}%</span>的概率患有<span style="color: red;">{{d.diease.name}}</span>
					</view>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	const opt_influx = getApp().globalData.opt_influxdb
	import {InfluxQuery} from "../../unijs/influx_query.js"
	import {getDevices, saveDevices,genderDict} from "../../unijs/userCache.js"
	export default {
		data() {
			return {
				chartData: {
							categories: [],
							series: [],
						},
				show_chart:false,
				
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
					padding: [15,10,0,15],
					dataLabel:false,
					enableScroll: true,
					width:5000,
					legend: {},
					xAxis: {
					  disableGrid: true,
					  rotateLabel:true,
					  rotateAngle:60,
					  itemCount:20,
					  marginTop:10
					},
					yAxis: {
					  gridType: "dash",
					  dashLength: 2
					},
					extra: {
					  line: {
						type: "curve",
						width: 2,
						activeType: "hollow"
					  }
					}
				},
				show_nothing:true,
				judge:null,//诊断结果
				timer:null,
				queryMode:{
					time:"-5d",
					interval:"30m",
					ids:["delta"]
				},
				influx_query:null,
				userinfo:{},
				genderDict:genderDict
			};
		},
		methods:{
			getServerData() {
				this.chartData.categories.splice(0)
				this.chartData.series.splice(0)
				this.show_chart=true
				this.show_nothing=false
				uni.$emit("log","正在查询数据库")
				let client_id=getApp().globalData.deviceid
				// console.log(client_id)
				let res=undefined
				let id = this.queryMode.ids
				let time = this.queryMode.time
				let interval = this.queryMode.interval
				
				// console.log(id)
			
				this.influx_query.query(client_id,time,interval,id)
				.then((res)=>{
					uni.$emit("log","收到influxdb："+JSON.stringify(res))
					this.chartData=res
					if(res.categories.length==0){
						this.show_chart=false
						this.show_nothing=true
					}
					console.log(this.chartData)
				},
				(err)=>
				{
					uni.$emit("log","query err!")
					uni.$emit("log","查询结束")
				})				
				console.log("查询结束！")
				// console.log(this.chartData)
			},
		},
		onLoad() {
			uni.$on("updateFootView",(data)=>{	
				this.judge=getApp().globalData.judges
			})
			const opt = opt_influx
			this.influx_query=new InfluxQuery(opt.url, opt.token, opt.org, opt.bucket)
			this.userinfo=getApp().globalData.currentUser
		},
		onShow(){
			this.getServerData()
			this.timer=setInterval(()=>{this.getServerData()},60*1000)
		},
		onHide(){
			clearInterval(this.timer)
			this.timer=null
		}
	}
</script>

<style lang="scss">
@font-face {
	font-family: "maobizi";
	src: url(../../static/font/ZhengQingKeLengKuTi-2.ttf);
}
.content{
	padding: 5px;
}
.keji{
	font-family: maobizi;
}
.chart_title{
	margin: auto;
	text-align: center;
	font-size: 25px;
	margin: 20rpx;
}
.log{
	margin: 5px;
	padding: 3px;
	border: 3px solid rgba(120,130,190,0.9);
	border-radius: 5px;
	background-color: rgba(120,130,190,0.6);
}

.judge{
	font-size: 24px;
}
.advice{
	font-size: 18px;
	color: orange;
}
.chart{
	margin: 5px;
	border: 1px solid blue;
	border-radius: 10px;
}
.userinfo{
	padding: 5px;
	font-size: 21px;
	font-weight: 600;
	text-shadow: gray 2px 2px 2px;
	
}
</style>
