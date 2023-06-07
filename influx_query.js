"use strict"
import { InfluxDB, Point } from '@influxdata/influxdb-client'
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
class InfluxQuery{
  constructor(url,token,org,bucket){
    this.url=url
    this.token=token
    this.org=org
    this.bucket=bucket
    this.data={
		categories:[],
		series:[]
	}
  }
  #getFlux(bucket,client_id,start,window){
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

/**
 * @param {Object} client_id 设备id
 * @param {Object} start 开始时间
 */
  query(client_id,start,window,senser_id){
    const queryApi = new InfluxDB({url:this.url, token:this.token}).getQueryApi(this.org)
    const fluxQuery = this.#getFlux(this.bucket, client_id, start, window)
    const myQuery = new Promise(async (resolve,reject)=>{
		console.log("正在查询...")
		uni.$emit("log","influx_query.query")
		for await (const {values, tableMeta} of queryApi.iterateRows(fluxQuery)) {
		  const o = tableMeta.toObject(values)
		  this.#addData(o,senser_id)
		  uni.$emit("log","get ont"+JSON.stringify(o))
		}
		resolve(this.data)
		console.log("查询完毕！")
		uni.$emit("log","influx_query.query ended") 
	})
    return myQuery
  }

  #addData(item,senser_id){
    // console.log(item)
    const categories = this.data.categories
    const series = this.data.series
    let time = item._time
    let id = item.id
	if(senser_id && id != String(senser_id))return
    let value = item._value
    let date = new Date(time).toTimeString().substring(0,8)
    if(!categories.find(ele => ele === date))categories.push(date)
    if(!series.find(ele => ele.name == id))series.push({name:id,data:[]})
    let data_item = series.find(ele => ele.name==id)
    data_item.data.push(value)
  }
}

export{
  InfluxQuery
}

