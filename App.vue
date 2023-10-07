<script>
	import mqtt from 'mqtt/dist/mqtt.js'
	//192.168.1.100
	//192.168.*.156
	// 120.26.95.127
	import {sign} from "./static/js/JWTUtils.js"
	import {judgeData} from "static/js/judge.js"
	import { data } from './uni_modules/uview-ui/libs/mixin/mixin.js'
	var ip = "121.43.108.78"
	var len = 0
	var buffer_data={}
	var state = {left:false,right:false}

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
						  if(topic=='post/foot/'+this.globalData.deviceid){
								let data = String(msgjson.value).split(",")
								let offset = 0
								if(msgjson.id=="left"){
									offset=0;
									state.left=true
								}else if(msgjson.id=="right"){
									offset=18;
									state.right=true
								}
								for(let i in data){
									buffer_data[Number(i)+offset+1]=data[i];
								}
								if(state.left&&state.right){
									this.globalData.judges = judge(Object.values(buffer_data))
									uni.$emit("updateFootView",buffer_data);
									console.log(this.globalData.judges)
									state.left=false
									state.right=false
								}
						  }else if(topic=='post/foot/'+this.globalData.deviceid+'/extraData'){
							uni.$emit("extraDataRecieved",msgjson)
						  }
					  }catch(err){
						  console.error(`not a json msg:${message}:${err}`)
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
