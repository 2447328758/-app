"use strict"
/**
 * @param {String} url influx服务网址
 * @param {String} token 具有操作权限的token
 * @param {String} org 组织名称
 * @param {String} bucket 水桶名称
 * @param {Object} data 数据接收对象
 * data 格式
 *  {
 *    categories: [],
 *    series: []
 *  }
 * @author 戴东阳
 * @tutorial
 * ```
 *  let data = {
 *  	categories: [],
 *  	series: [
 *  	]
 *	}
 *	const query = new InfluxQuery(url,token,org,bucket,data)
 *	query.query(client_id)()
 * ```
 */
function InfluxQuery(url,token,org,bucket){
	this.url=url
	this.token=token
	this.org=org
	this.bucket=bucket
	this.data={
		categories:[],
		series:[]
	}
	
	this.getFlux= function(bucket,client_id,start,window){
		return `toTimestamp = (tables=<-) => tables
|> map(fn: (r) => ({r with _time: uint(v: r._time)}))

divideByX = (x, tables=<-) => tables
|> map(fn: (r) => ({r with _time: r._time/x}))

from(bucket: "${bucket}")
|> range(start: ${start})
|> filter(fn: (r) => r["_measurement"] == "data")
|> filter(fn: (r) => r["_field"] == "value")
|> filter(fn: (r) => r["client_id"] == "${client_id}")
|> aggregateWindow(every: ${window}, fn: mean, createEmpty: false)
|> group(columns: ["id"], mode: "by")
|> toTimestamp()
|> divideByX(x: uint(v: 1000000))`
		}
	  
		this.query=function(client_id,start,window,senser_id){
			try{
				// const queryApi = new InfluxDB({url:this.url, token:this.token}).getQueryApi(this.org)
				const fluxQuery = this.getFlux(this.bucket, client_id, start, window)
				this.log+="raw log in query!!!!!!!!!!!!!!!!!!!!!!!!!!"
				uni.$emit("log","influx_query.query entering")
				const myQuery = new Promise(async (resolve,reject)=>{
					console.log("正在查询...")
					uni.$emit("log","influx_query.query async start")
					try{
						// for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
						// 	const o = tableMeta.toObject(values)
						// 	this.addData(o,senser_id)
						// 	uni.$emit("log","get ont"+JSON.stringify(o))
						// }
						uni.showLoading({
							title:"查询中..."
						})
						let res = await uni.request({
							method:"POST",
							url:`${this.url}/api/v2/query?org=${this.org}`,
							header:{
								"Accept-Encoding":"identity",
								"Content-Type":"application/json",
								"Authorization":`Token ${this.token}`
							},
							data:{
								query:fluxQuery,
								type:"flux"
							},
							timeout:5000
						})
						uni.hideLoading()
						uni.showToast({
							title:"查询成功！",
						})
						let data = []
						let d = res.data.split("\r\n")
						for(let i in d){
							if(d[i]==='')continue
							data.push(d[i].split(",").filter(ele=>ele!=""))
						}
						let headers = data[0]
						for(let i=1;i<data.length;i++ ){
							let o = Object.create(null)
							for(let j in headers){
								o[headers[j]]=data[i][j]
							}
							this.addData(o,senser_id)
						}
						resolve(this.data)
						
						console.log("查询完毕！")
						uni.$emit("log","influx_query.query async ended")
					}catch(err){
						uni.$emit("log","influx_query.query async err:")
						uni.$emit("log",JSON.stringify(err))
						uni.hideLoading()
						uni.showToast({
							title:"查询失败！",
							icon:"error"
						})
					}
				})
				uni.$emit("log","influx_query.query ending")
				return myQuery
			}catch(err){
				uni.$emit("log",err)
			}
			
		}
		this.addData=function(item,senser_id){
			// console.log(item)
			item._time = Number(item._time)
			item._value = Number(item._value)
			const categories = this.data.categories
			const series = this.data.series
			let time = item._time
			let id = item.id
			if(senser_id && id != String(senser_id))return
			let value = item._value.toFixed(2)
			let date = new Date(time).toTimeString().substring(0,8)
			if(!categories.find(ele => ele === date))categories.push(date)
			if(!series.find(ele => ele.name == id))series.push({name:id,data:[]})
			let data_item = series.find(ele => ele.name==id)
			data_item.data.push(value)
		}
	  return this
}

export{
  InfluxQuery
}

