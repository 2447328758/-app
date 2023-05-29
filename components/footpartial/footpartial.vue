<template>
	<view class="content">
		<canvas :style="{width: windowWidth+'px', height: windowHeight+'px'}" canvas-id="firstCanvas" id="firstCanvas"></canvas>
	</view>
</template>

<script>
function FootPartial(x,y,min,max,value,path,startPos,color,width,height,id){
	this.id=id
	this.pos=[x,y]
	this.max=max
	this.min=min
	this.value=value
	this.percent=this.value/(this.max-this.min)*0.8+0.2
	this.path=path
	this.color=color
	this.startPos=startPos
	this.width=width
	this.height=height
	this.draw = function(context){
		context.save()
		context.translate(this.pos[0],this.pos[1])//平移
		
		//绘制轮廓
		context.setFontSize(15)
		context.setFillStyle("rgba(255,0,0,"+this.percent+")")
		context.strokeRect(0,0,this.width,this.height)
		
		// 绘制鞋垫传感器轮廓
		context.beginPath()
		context.setFillStyle("rgba("+this.color.join(',')+","+this.percent+")")
		context.moveTo(this.startPos[0],this.startPos[1])
		for(let i in this.path){
			// console.log(i)
			context.bezierCurveTo(this.path[i][0],this.path[i][1],this.path[i][2],this.path[i][3],this.path[i][4],this.path[i][5])
		}
		context.closePath()
		context.fill()
		context.stroke()
		context.setFillStyle("#000000")
		context.setFontSize(12)
		context.fillText(this.id.toString()+":"+this.value.toString()+"pa",this.width*0.1,this.height*0.45)
		
		
		context.restore()//回复变换矩阵
		// context.bezierCurveTo()
	}
	this.setValue=function(value){
		this.value=value
		this.percent=this.value/(this.max-this.min)*0.8+0.2
	}
	return this
}

import {foot_model} from "../../model.js"
export default {
	name: "footpartial",
	props: {
		x: {
			default: "xiaoming",
		},
	},
	data(){
		return {
			foot:{
				
			},
			context:null,
			windowHeight:900,
			windowWidth:900,
			imageWidth:569,
			imageHeight:674
		}
	},
	mounted: async function () {
		let systeminfo = await uni.getSystemInfo()
		this.windowHeight =  systeminfo.windowHeight-systeminfo.windowBottom
		this.windowWidth =  systeminfo.windowWidth
		// console.log(foot_model)
		this.context=uni.createCanvasContext('firstCanvas', this)	
		for(let i in foot_model){
			let {x,y,min,max,value,path,startPos,color,width,height,id}=foot_model[i]
			this.foot[i]=new FootPartial(x,y,min,max,value,path,startPos,color,width,height,id)
		}
		// console.log(this.foot)
		this.update({})
	},
	methods: {
		update(data){//key 和 value 是Number类型，是一个对象
		let rate = this.windowWidth/this.imageWidth
		this.context.scale(rate,rate)
			for(let i in data){
				this.foot[i].setValue(data[i])
			}
			for(let i in this.foot){
				this.foot[i].draw(this.context)
			}
			this.context.draw()
		}
	},
}
</script>

<style lang="scss">
.content{
	canvas {
		box-sizing: border-box;
		// border: 2px solid black;
	}
}

</style>
