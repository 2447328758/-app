<script>
	import mqtt from 'mqtt/dist/mqtt.js'
	//192.168.1.100
	//192.168.*.156
	// 120.26.95.127
	import {sign} from "./static/js/JWTUtils.js"
	var ip = "120.26.95.127"
	var data_queue={}
	var len = 0
	var edge = 0.1
	function judgeone(data_queue){
		let sum = 0
		for(let i in data_queue){
			sum+=data_queue[i]
		}
		let per = data_queue["5"]+data_queue["6"]+data_queue["11"]
					+data_queue["12"]+data_queue["15"]+data_queue["16"]
		let percent = (per/sum).toFixed(3)
		let ill_percent=(percent-edge)/edge/5
		ill_percent=ill_percent<0?0:(ill_percent*100).toFixed(1)
		return {percent:ill_percent,advices:`有${ill_percent}%的概率为扁平足`}
	}
	function judge(data_queue){
		let left = judgeone(data_queue.slice(0,18))
		let right = judgeone(data_queue.slice(18,36))
		return {
			left:left,
			right:right
		}
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
			deviceid:"123",
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
			],
			opt_influxdb:{
				url:`http://${ip}:8086`,
				org:"cgqgzs",
				bucket:"foot",
				_measurement:"data",
				_field:"value",
				token:"bRGdoe6kKmbZvI1gpLiDzAzpy-q6QzQeFnWizc7E09yW9YbSX0xuQqMV_NR97zR3GIGBnbk-zQkpiSdAbLjHeA=="
			},
			judges:{
				left:{
					percent:0,
					advices:""
				},
				right:{
					percent:0,
					advices:""
				}
			}
		},
		methods:{
			onConnected(){
				let client = getApp().globalData.client
				let msgs = getApp().globalData.msgs
				client.on("message",
					(topic, message) =>{
					  try{
						  let msgjson=JSON.parse(message.toString())
						  // if(topic=='post_foot'){
						  if(topic=='post/foot/'+this.globalData.deviceid){
								data_queue[msgjson.id]=msgjson.value
								len++
								if(len>36){
									// console.log(Object.values(data_queue))
									this.globalData.judges = judge(Object.values(data_queue))
									uni.$emit("updateFootView",data_queue)
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
				getApp().globalData.client.subscribe("post/foot/"+this.deviceid)
				getApp().globalData.client.subscribe("post/foot/"+this.deviceid+"/#")
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
