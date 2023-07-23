<script>
	import mqtt from 'mqtt/dist/mqtt.js'
	//192.168.1.100
	//192.168.*.156
	// 120.26.95.127
	import {sign} from "./static/js/JWTUtils.js"
	import {judgeData} from "static/js/judge.js"
	import { data } from './uni_modules/uview-ui/libs/mixin/mixin.js'
	var ip = "121.43.108.78"
	var data_queue={}
	var len = 0
	var edge = 0.1

	function judge(data_queue){
		// console.log(data_queue)
		return judgeData(data_queue)
	}
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData:{
			doctor:null,
			currentUser:{
				did:"",
				username:"",
				weight:0,
				gender:-1,
				age:20
			},
			deviceid:"_device",
			msgs:[{
				topic:"test_topic",
				msg:"test_msg"
			}],
			options:{
				clientId:"test_55",
				clean:true,
				connectTimeout:30000,
				username:"test_63",
				password:"123456",
				keepalive:60
			},
			// #ifdef H5
			broker:"ws://"+ip+":8083/mqtt",
			// #endif
			// #ifdef APP-PLUS
			broker:"wx://"+ip+":8083/mqtt",
			// #endif
			// #ifdef MP-WEIXIN
			broker:"wx://"+ip+":8083/mqtt",
			// #endif
			
			client:null,
			status:{
				connecting:false,
				connected:false
			},
			topic_sub:[
				"post_foot",
				"post/foot/_device/#"
			],
			opt_influxdb:{
				url:`http://${ip}:8086`,
				org:"cgqgzs",
				bucket:"foot",
				_measurement:"data",
				_field:"value",
				token:"rKv9lSfB_48eJYikE7F86i3Hum-PyRpvuFsbsPJzsL8f3aR5ek9gyAlNE1cwY-PZj9pb_0L7xMeEwYSRgVDnlQ=="
			},
			judges:undefined,
			msg_recieved:false
		},
		methods:{
			onConnected(){
				let client = getApp().globalData.client
				let msgs = getApp().globalData.msgs
				client.on("message",
					(topic, message) =>{
						getApp().globalData.msg_recieved=true
					  try{
						  let msgjson=JSON.parse(message.toString())
						  // if(topic=='post_foot'){
						  if(topic=='post/foot/'+this.globalData.deviceid){
								data_queue[msgjson.id]=msgjson.value
								let data = {}
								data[msgjson.id]=msgjson.value
								uni.$emit("updateFootView",data)
								len++
								if(Object.values(data_queue).length==36){
									console.log(data_queue,Object.values(data_queue).length)
									this.globalData.judges = judge(Object.values(data_queue))
									// uni.$emit("updateFootView",data_queue)
									data_queue={}
									len=0
								}
						  }else if(topic=='post/foot/'+this.globalData.deviceid+'/extraData'){
							uni.$emit("extraDataRecieved",msgjson)
						  }
					  }catch(err){
						  console.log(`not a json msg:${message}:${err}`)
					  }
					  msgs.push({
						  topic:topic,
						  msg:message
					  })
					  getApp().globalData.msg_recieved=false
					}
				)
				getApp().globalData.topic_sub.forEach((value,index)=>{
					client.subscribe(value,(err)=>{
						if(err)
							uni.showToast({
								title:"订阅成功！"
							})
					})
				})
			},
			createConnection(){
				uni.showLoading({
					title:"连接中..."
				})
				let globe = getApp().globalData
				globe.client=mqtt.connect(globe.broker,globe.options)
				globe.client.on("error",
					(error) =>{
					  uni.showToast({
					  	title:"错误！"+error.message
					  })
					  globe.status.connecting=false
					  globe.status.connected=false
					}
				)
				globe.status.connecting=true;
				globe.client.on("connect",
					(res)=>{
						uni.showToast({
							title:"连接成功",
							duration:1000
						})
						// uni.hideLoading()
						console.log(res)
						globe.status.connected=true;
						globe.status.connecting=false;
						this.onConnected()
						uni.hideLoading()
					},
					(err)=>{
						console.log(err)
						globe.status.connected=false
						globe.status.connecting=false
						uni.showToast({
							title:"连接失败"+err,
							icon:"error"
						})
					}
				)
			}
		},
		
		onLaunch() {			
			this.globalData.msgs = new Array(20).fill({
				topic:"test_topic",
				msg:"test_msg"
			})
			this.globalData.options.clientId="app_foot_"+(Math.random()*1000000).toFixed(0)
			this.globalData.options.username=this.globalData.options.clientId
			this.globalData.options.password=sign({username:this.globalData.options.username,clientid:this.globalData.options.clientId})
			this.createConnection()
		},
		destroyed() {
			let client = getApp().globalData.client
			if(client !=null){
				client.end(false,()=>{
					uni.showLoading({
						title:"断开连接中..."
					})
					console.log("disconnect successfully")
					uni.hideLoading()
					uni.showToast({
						title:"disconnect successfully"
					})
				})
			}
		}
	}
</script>

<style lang="scss">
@import "@/uni_modules/uview-ui/index.scss";
@import url('./static/bootstrap-4.6.2-dist/css/bootstrap.css');
</style>
