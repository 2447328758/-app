<template>
	<view class="content">
		<canvas @click="choose_partial($event,true)" :style="{width: canvasWidth+'px', height: canvasHeight+'px'}" canvas-id="firstCanvas" id="firstCanvas"></canvas>
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
			context.bezierCurveTo(this.path[i][0],this.path[i][1],this.path[i][2],this.path[i][3],this.path[i][4],this.path[i][5])
		}
		context.closePath()
		context.fill()
		context.setStrokeStyle("rgba(0,0,0,0.5)")
		context.stroke()
		context.setFillStyle("#000000")
		context.setFontSize(this.width/6+this.height/15)
		// context.fillText(this.id.toString()+":"+this.value.toString()+"pa",
		// 		this.left_top[0]+this.width*0.1, this.left_top[1]+ this.height*0.45)
		context.fillText(this.value.toString(),
				this.left_top[0]+this.width*0.45, this.left_top[1]+ this.height*0.45)
		// context.restore()//回复变换矩阵
		// context.bezierCurveTo()
	}
	this.setValue=function(value){
		this.value=value
		this.percent=this.value/(this.max-this.min)*0.8+0.2
	}
	this.isContain=(x,y) =>  x>=this.left_top[0]-2 && x<=this.left_top[0]+this.width+2 && y>=this.left_top[1] && y<=this.left_top[1]+this.height
	return this
}

import {foot_model} from "../../model.js"
export default {
	name: "footpartial",
	props: {
		"pageScrollx":{
			default:0,
			type:[Number]
		},
		"pageScrolly":{
			default:0,
			type:[Number]
		}
	},
	data(){
		return {
			foot:{
				
			},
			context:null,
			windowHeight:900,
			windowWidth:900,
			imageWidth:138*2,
			imageHeight:370,
			canvasWidth:1000,
			canvasHeight:1000,
			canvasInfo:0,
			top:65
		}
	},
	mounted: async function () {
		let systeminfo = await uni.getSystemInfo()
		this.windowHeight =  systeminfo.windowHeight-systeminfo.windowBottom
		this.windowWidth =  systeminfo.windowWidth
		this.canvasHeight=Math.round(this.imageHeight*this.rate)
		this.canvasWidth=Math.round(this.imageWidth*this.rate)
		this.context=uni.createCanvasContext('firstCanvas', this)
		let windowinfo = uni.getWindowInfo()
		this.top=windowinfo.windowTop*2
		for(let i in foot_model){
			let {x,y,min,max,value,path,startPos,color,width,height,id,startTag}=foot_model[i]
			this.foot[i]=new FootPartial(x,y,min,max,value,path,startPos,color,width,height,id,startTag)
		}
		this.update({})
		this.getOffsetX()
		// console.log((this.windowWidth-this.imageWidth*this.rate)/2)
	},
	methods: {
		async getOffsetX(){
			let selectQuery = uni.createSelectorQuery();
			selectQuery.select("#firstCanvas").boundingClientRect((result)=>{
				// console.log(result)
				this.top=result.top
			}).exec()
			
		},
		update(data,update=true){//key 和 value 是Number类型，是一个对象
			this.data = data
			let rate = this.rate
			// console.log(rate)
			this.context.scale(rate,rate)
			for(let i in data){
				try{
					this.foot[i].setValue(data[i])
				}catch(e){
					console.log(i)
				}
			}
			for(let i in this.foot){
				this.foot[i].draw(this.context)
			}
			
			// this.context.strokeRect(0,0,180,370)
			if(update)
				this.context.draw()
		},
		choose_partial(e,show_click_point){
			// console.log(e)
			let {x,y} = e.detail
			y-=this.top
			console.log(this.top)
			// y-=65
			x+=this.pageScrollx
			y+=this.pageScrolly
			x-=(this.windowWidth-this.imageWidth*this.rate)/2
			x/=this.rate
			y/=this.rate
			// console.log(x,y)
			
			// console.log(this.pageScrolly)
			// console.log(x,y)
			// Create circular gradient
			if(show_click_point){
				this.update(this.data,false)
				const grd = this.context.createCircularGradient(x, y, 5)
				grd.addColorStop(0, 'red')
				grd.addColorStop(0.5, 'green')
				grd.addColorStop(1, 'rgba(0,0,0,0)')
				
				// Fill with gradient
				this.context.setFillStyle(grd)
				this.context.fillRect(x-2.5, y-2.5, 5, 5)
				this.context.draw()
			}
			for(let i in this.foot){
				if(this.foot[i].isContain(x,y)){
					// console.log(this.foot[i]);
					this.$emit("footClicked",this.foot[i])
					break;
				}
			}
		}
	},
	computed:{
		rate(){
			let rate = this.windowWidth/this.imageWidth
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
		margin: auto;
	}
}

</style>
