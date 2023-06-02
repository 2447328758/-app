<template>
	<view class="content">
		<canvas :style="{width: windowWidth+'px', height: windowHeight+'px'}" canvas-id="firstCanvas" id="firstCanvas"></canvas>
	</view>
</template>

<script>
function FootPartial(x,y,min,max,value,path,startPos,color,width,height,id,startTag){
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
	this.startTag = startTag
	
	let left_top = [this.startPos[0],this.startPos[1]]
	switch(this.startTag){
		case 0: 
			break;
		case 1:
			left_top[1] = left_top[1]-this.height; 
			break;
		case 2:
			left_top[0] = left_top[0]-this.width;
			break;
		case 3:
			left_top[1] = left_top[1]-this.height;
			left_top[0] = left_top[0]-this.width;
			break;
	}
	this.left_top = left_top
	
	this.draw = function(context){
		context.save()
		// context.translate(this.pos[0],this.pos[1])//平移
		
		//绘制轮廓
		// context.setStrokeStyle("rgba(255,0,0,0.5)")
		// context.strokeRect(this.left_top[0],this.left_top[1],this.width,this.height)

		
		
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
		context.setStrokeStyle("rgba(0,0,0,0.5)")
		context.stroke()
		context.setFillStyle("#000000")
		context.setFontSize(this.width/6+this.height/15)
		context.fillText(this.id.toString()+":"+this.value.toString()+"pa",
				this.left_top[0]+this.width*0.1, this.left_top[1]+ this.height*0.45)
		
		
		
		// context.restore()//回复变换矩阵
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
		
	},
	data(){
		return {
			foot:{
				
			},
			context:null,
			windowHeight:900,
			windowWidth:900,
			imageWidth:360,
			imageHeight:370
		}
	},
	mounted: async function () {
		let systeminfo = await uni.getSystemInfo()
		this.windowHeight =  systeminfo.windowHeight-systeminfo.windowBottom
		this.windowWidth =  systeminfo.windowWidth
		// console.log(foot_model)
		this.context=uni.createCanvasContext('firstCanvas', this)	
		for(let i in foot_model){
			let {x,y,min,max,value,path,startPos,color,width,height,id,startTag}=foot_model[i]
			this.foot[i]=new FootPartial(x,y,min,max,value,path,startPos,color,width,height,id,startTag)
		}
		// console.log(this.foot)
		this.update({})
	},
	methods: {
		update(data){//key 和 value 是Number类型，是一个对象
			let rate = this.rate
			// console.log(rate)
			this.context.scale(rate,rate)
			for(let i in data){
				this.foot[i].setValue(data[i])
			}
			for(let i in this.foot){
				this.foot[i].draw(this.context)
			}
			
			// this.context.strokeRect(0,0,180,370)
			this.context.draw()
		}
	},
	computed:{
		rate(){
			let rate = this.windowWidth/this.imageWidth
			console.log(this.windowHeight,this.windowWidth)
			if (this.windowHeight/this.windowWidth > this.imageHeight/this.imageWidth)
				rate = this.windowWidth/this.imageWidth
			else
				rate = this.windowHeight/this.imageHeight
			return rate
		}
	}
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
