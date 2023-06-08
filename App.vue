<script>
	import mqtt from 'mqtt/dist/mqtt.js'
	import  {value_model,switch_model} from "model.js"
	//192.168.1.100
	//192.168.*.156
	// 120.26.95.127
	var ip = "120.26.95.127"
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
			value_model:value_model,
			switch_model:switch_model,	
			msgs:[{
				topic:"test_topic",
				msg:"test_msg"
			}],
			options:{
				clientId:"test_2",
				clean:true,
				connectTimeout:30000,
				username:"test_2",
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
				"post",
				"post_foot",
				"inner_temp",
				"chill_temp",
				"test"
			],
			opt_influxdb:{
				url:`http://${ip}:8086`,
				org:"cgqgzs",
				bucket:"foot",
				_measurement:"data",
				_field:"value",
				token:"bRGdoe6kKmbZvI1gpLiDzAzpy-q6QzQeFnWizc7E09yW9YbSX0xuQqMV_NR97zR3GIGBnbk-zQkpiSdAbLjHeA=="
			}
		},
		methods:{
			setModelValue(msgjson){
				for(let i =0;i<getApp().globalData.value_model.length;i++){
					if(getApp().globalData.value_model[i].id==msgjson.id){
						getApp().globalData.value_model[i].value=msgjson.value
					}
				}
				
				for(let i =0;i<getApp().globalData.switch_model.length;i++){
					if(getApp().globalData.switch_model[i].id==msgjson.id){
						getApp().globalData.switch_model[i].value=msgjson.value
					}
				}
				
			},
			onConnected(){
				let client = getApp().globalData.client
				let msgs = getApp().globalData.msgs
				client.on("message",
					(topic, message) =>{
					  // message is Buffer
					  try{
						  let msgjson=JSON.parse(message.toString())
						  if(topic=='post')this.setModelValue(msgjson)
						  if(topic=='post_foot'){
								let a = {}
								a[msgjson.id]=msgjson.value
								uni.$emit("updateFootView",a)
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
</style>
