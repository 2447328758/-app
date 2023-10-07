<template>
	<view class="content">
		<bgImg></bgImg>
		<view class="chart_title keji">
			<text class="badge-info badge" style="font-size: 25px;">可视化</text>
		</view>
		<!-- 鞋垫 -->
		<view class="xiedian">
			<footpartial @footClicked="onFootClicked" ref="footCanvas" :pageScrollx="pageScrollx" :pageScrolly="pageScrolly"></footpartial>
			<h4 style="text-align: right; margin-right: 50rpx; transform: translateY(-120%);">单位：N</h4>
			<view class="extraData keji" style="font-size: 14px;">
				<text class="extraData item">左脚压力平均值：{{extraData.left}}</text>
				<text class="extraData item">左右脚平均压力差：{{extraData.delta}}</text>
				<text class="extraData item">右脚压力平均值：{{extraData.right}}</text>
			</view>
		</view>
		
		<!-- 查询模式 -->
		<!-- <view class="chart_title keji">
			<text class="badge-info badge" style="font-size: 25px;">数据曲线</text>
			<view class="queryMode">
				<view class="btn-group-sm">
					<button class="btn btn-outline-primary" @click="queryMode.time='-1d';queryMode.interval='5m';getServerData();">一天内</button>
					<button class="btn btn-outline-primary" @click="queryMode.time='-30m';queryMode.interval='40s';getServerData();">30分钟内</button>
					<button class="btn btn-outline-primary" @click="queryMode.ids=[];  queryMode.ids=['left','right','delta'] ;getServerData();">额外数据</button>
				</view>
			</view>
		</view> -->
		
		
		<!-- 压力值图表 -->
		<view class="chart">
			<view class="chart_title keji">
				<text>------压力值------</text>
				<br/>
				<text style="font-size: 15px;">{{foot_choosed==null?"":"传感器id:"+foot_choosed.id}}</text>
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
			<text class="badge-info badge" style="font-size: 25px;">参考结果</text>
			<view class="judge one">
				<text class="badge badge-dark">左脚</text>
				<br/>
				<text class="advice">{{judge?judge.left.advices:"无建议"}}</text>
			</view>
			<view class="judge one">
				<text class="badge badge-dark">右脚</text>
				<br/>
				<text class="advice">{{judge?judge.right.advices:"无建议"}}</text>
			</view>
		</view>
		<!-- <view class="log">
			<u-button @click="log=''" size="mini">清空</u-button>
			<textarea  cols="30" rows="10" placeholder="日志" style="width: 100%;" :value="log"></textarea>
		</view> -->
	</view>
</template>

<script>
	const opt_influx = getApp().globalData.opt_influxdb
	import footpartial from "@/components/footpartial/footpartial.vue"
	import {InfluxQuery} from "../../unijs/influx_query.js"
	export default {
		onReady(){
		},
		components:{footpartial},
		data() {
			return {
				/**
				 * 
				 * 压力值的数据
				 * 
				 * 
				 */
				chartData: {
							categories: [],
							series: [],
						},
				show_chart:false,
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
				foot_choosed:null,
				influx_query:null,
				log:"",
				pageScrollx:0,
				pageScrolly:0,
				show_nothing:true,
				choose_only:true,//是否只显示选定的
				judge:null,
				timer:null,
				queryMode:{
					time:"-30m",
					interval:"30s",
					ids:[]
				},
				extraData:{
					left:0,
					right:0,
					delta:0
				},
				footCanvas:undefined
			}
		},
		methods: {
			onFootClicked(foot){
				this.show_chart=true
				this.show_nothing=false
				this.foot_choosed=foot
				this.queryMode.ids=[this.foot_choosed.id]
				this.getServerData()
			},
			getServerData() {
				this.chartData.categories.splice(0)
				this.chartData.series.splice(0)
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
		onLoad(){
			const opt = opt_influx
			this.influx_query=new InfluxQuery(opt.url, opt.token, opt.org, opt.bucket)
			uni.$on("log",(log)=>this.log+=log+"\n")
			// uni.$emit("log",this.influx_query.query)
			
			uni.$on("extraDataRecieved",(data)=>{
				this.extraData[data.id]=data.value
			})
		},
		mounted() {
			let that = this
			this.footCanvas=this.$refs.footCanvas
			uni.$on("updateFootView",(data)=>{
				that.footCanvas.update(data)
				this.judge=getApp().globalData.judges
			})
		},
		onPageScroll(e) {
			if(e.scrollTop)this.pageScrolly=e.scrollTop
		},
		onShow(){
			this.timer=setInterval(()=>{this.getServerData(this.choose_only)},60*1000)
		},
		onHide(){
			clearInterval(this.timer)
			this.timer=null
		}
	}
</script>

<style>
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
	height: 50px;
	/* margin: 20rpx; */
}
.log{
	margin: 5px;
	padding: 3px;
	border: 3px solid rgba(120,130,190,0.9);
	border-radius: 3px;
	background-color: rgba(120,130,190,0.6);
}
.u-notice-bar{
	text-align: center;
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
.extraData{
	display: flex;
	align-content: space-between;
}

.extraData .item{
	display: inline;
	flex: 1;
	font-size: 40rpx;
	text-align: center;
	border: 1px solid darkblue;
	margin: 2px;
}

</style>
