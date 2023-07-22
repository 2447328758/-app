/*
 * @Author: 戴东阳 2447328758@qq.com
 * @Date: 2023-07-16 17:22:16
 * @LastEditors: 戴东阳 2447328758@qq.com
 * @LastEditTime: 2023-07-17 21:11:17
 * @FilePath: \fluxdb\judge.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

//average 是否是平均值
//side是否是和另一边比较
let JI_ZHU_CE_WAN={
    name:"脊柱侧弯",
    edge:1.1,
    indexs:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
    average:true,
    side:true,
    ratio:false,
    step:0.2
}
let XI_NEI_FAN={
    name:"膝内翻",
    edge:1.05,
    indexs:[1,2,3,4],
    ratio:true,
    side:false,
    average:true,
    step:0.1
}
let GU_GUAN_JIE_YAN={
    name:"骨关节炎",
    edge:1.05,
    indexs:[9,10,15,16,17,18],
    ratio:true,
    side:false,
    average:true,
    step:0.1
}
let QINGDU_BIAN_PING_ZU={
    name:"轻度扁平足",
    edge:0.7,
    indexs:[11],
    side:false,
    average:true,
    ratio:true,
    step:0.05
}
let ZHONGDU_BIAN_PING_ZU={
    name:"重度扁平足",
    edge:0.85,
    indexs:[11,12],
    side:false,
    average:true,
    ratio:true,
    step:0.05
}


let dieases = [
    JI_ZHU_CE_WAN,
    XI_NEI_FAN,
    GU_GUAN_JIE_YAN,
    QINGDU_BIAN_PING_ZU,
    ZHONGDU_BIAN_PING_ZU
]

function judgeData(senserDatas){
    let left = {data:senserDatas.slice(0,18),diagnostic:[]}
    let right = {data:senserDatas.slice(18,36),diagnostic:[]}
    //todo 计算每个病的概率，并返回
    for(let i in dieases){
        addDiagnostic(left,right,dieases[i])
        addDiagnostic(right,left,dieases[i])
    }
    return {
        left:left,
        right:right
    }
}


function addDiagnostic(oneSideData,annotherSideData,diease){
    let percent = getPossibility(oneSideData,annotherSideData,diease)
    if(percent.percent === 0)return
    oneSideData.diagnostic.push(percent)
}


function calOneSide(oneSideData,diease){
    let average1 = 0
    let total1 = 0

    for(let i in oneSideData.data){
        if(diease.indexs.find((value)=>Number(i)+1 === value)){
            average1+=oneSideData.data[i]
        }
        total1+=oneSideData.data[i]
    }
    average1/=diease.indexs.length
    total1/=oneSideData.data.length

    return {
        average:average1,
        total_average:total1
    }
}

function getPossibility(oneSideData,annotherSideData,diease){
    let data_calculated=[{},{}]
    if(oneSideData){
        data_calculated[0]=calOneSide(oneSideData,diease)
    }
    if(annotherSideData){
        data_calculated[1]=calOneSide(annotherSideData,diease)
    }


    if(diease.side){
        let percent = calPossibility(
            data_calculated[0].total_average,
            data_calculated[1].total_average,
            diease.edge,
            diease.step
        )
        return {
            diease:diease,
            percent:percent,
            total_average:data_calculated
        }
    }else{
        let ratio=data_calculated[0].average/data_calculated[0].total_average
        let percent = calPossibility(
            data_calculated[0].average,
            data_calculated[0].total_average,
            diease.edge,
            diease.step
        )
        return {
            diease:diease,
            percent:percent,
            ratio:ratio,
            data_calculated: data_calculated[0]
        }
    }
}

function calPossibility(val1,val2,edge,step){
    let percent = 0
    if(val1 >= val2 * edge){
        percent = 10
    }
    let nums=[1,2,3]
    for(let i in nums){
        if(val1 >= val2 * (edge+step*nums[i]))
        {
            percent += 20
        }
    }
    return percent
}

// console.log(calPossibility(0.7,1,0.6,0.05))
// console.log(getPossibility(
//     oneSideData,annotherSideData,JI_ZHU_CE_WAN
// ))

// console.log(getPossibility(
//     oneSideData,undefined,ZHONGDU_BIAN_PING_ZU
// ))


// console.log(
//     calOneSide(oneSideData,ZHONGDU_BIAN_PING_ZU)
// )


function example(){
    let oneSideData={
        data:[0,0,0,0,0,0,0,0,0,0,0,1000,99,0,0,0,0,1]
    }
    let annotherSideData={
        data:[1,2,3,1,5,1,2,3,1,2,3,3,2,6,5,2,1,4]
    }
    let result = judgeData(oneSideData.data.concat(annotherSideData.data))
    console.log(JSON.stringify(result))
}


// console.log(result.left.diagnostic)
// console.log(Object.is(result.left.diagnostic[0].diease,JI_ZHU_CE_WAN))  true


// example()

export {judgeData}





