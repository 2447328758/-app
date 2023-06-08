<template>
	<view class="content">
	<footpartial @footClicked="onFootClicked" ref="footCanvas" :pageScrollx="pageScrollx" :pageScrolly="pageScrolly"></footpartial>
	<view class="chart_title">
		<text>{{foot_choosed==null?"":"传感器id:"+foot_choosed.id}}</text>
	</view>
	<qiun-data-charts
		v-if="show_chart"
		type="line"
		:opts="opts"
		:chartData="chartData"
	    />
		<view class="u-notice-bar" :style="{display:show_nothing?'block':'none'}">
			没有数据
		</view>
		<view class="log">
			<textarea  cols="30" rows="10" placeholder="日志" style="width: 100%;" :value="log"></textarea>
		</view>
	</view>
</template>

<script>
	const opt_influx = getApp().globalData.opt_influxdb
	import footpartial from "@/components/footpartial/footpartial.vue"
	import {InfluxQuery} from "./influx_query.js"
	export default {
		onReady(){
		},
		components:{footpartial},
		data() {
			return {
				chartData: {
							categories: [],
							series: []
						},
				show_chart:false,
				//您可以通过修改 config-ucharts.js 文件中下标为 ['line'] 的节点来配置全局默认参数，如都是默认参数，此处可以不传 opts 。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
				opts: {
					color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
					padding: [15,10,0,15],
					enableScroll: false,
					legend: {},
					xAxis: {
					  disableGrid: true,
					  rotateLabel:true,
					  rotateAngle:60
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
				show_nothing:false,
				choose_only:true//是否只显示选定的
			}
		},
		methods: {
			onFootClicked(foot){
				this.chartData.categories.splice(0)
				this.chartData.series.splice(0)
				this.show_chart=true
				this.foot_choosed=foot
				this.getServerData(this.choose_only)
			},
			getServerData(choose_only=false) {
				uni.$emit("log","正在查询数据库")
				// this.influx_query.query(this.globalData.options.clientId)
				// console.log(this.influx_query)
				let client_id="nodejs_vscode"
				let res=undefined
				let id = undefined
				
				if(choose_only)id = this.foot_choosed.id
				this.influx_query.query(client_id,"-5m","30s",id)
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
			}
		},
		onLoad(){
			let that = this
			uni.$on("updateFootView",(data)=>{
				that.$refs.footCanvas.update(data)
			})
			const opt = opt_influx
			this.influx_query=new InfluxQuery(opt.url, opt.token, opt.org, opt.bucket)
			uni.$on("log",(log)=>this.log+=log+"\n")
			// uni.$emit("log",this.influx_query.query)
		},
		onPageScroll(e) {
			if(e.scrollTop)this.pageScrolly=e.scrollTop
			// console.log(e.scrollTop)
		}
	}
</script>

<style>
.chart_title{
	margin: auto;
	text-align: center;
	font-size: 25px;
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
</style>
