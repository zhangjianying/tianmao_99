const width = device.width;
const height = device.height;

auto.waitFor();

//启动淘宝, miui不知道为什么不能自动起来. miui的系统需要手工进入淘宝后再启动脚本
// app.launch("com.taobao.taobao");
// sleep(5000);

//模拟手势向下滑动
function gest_down(){
    gestures([0, 500, [800, 1000], [500, 300]],
        [0, 500, [300, 2000], [500, 900]]);
}
//模拟手势向上滑动
function gest_up(){
    gestures([0, 500, [800, 300], [500, 1000]],
        [0, 500, [300, 900], [500, 200]]);
}


//任务执行状态
function job_status(oneJob){
    let btn = oneJob.parent().findOne(className("android.widget.Button"));
    if(!btn){
        return false;
    }
    return btn.text() ==="已完成";
}

//执行具体的任务 ,返回true的时候表示 需要进入下一个迭代
// tag1: 浏览15秒得75星星 浏览15秒得50星星
function doingJob(jobTag){
    let oneJob ;
    let isEnd;
    let list = textContains(jobTag).find();
    if(!list.empty()){
        console.log("当前任务:["+jobTag+"] 任务列表有任务")
        let isRuned = false;
        list.forEach(function(uiObject){
                let oneJob = text(uiObject.text()).findOne();
                isEnd = job_status(oneJob)
                console.log("执行子任务:"+uiObject.text()+" 子任务状态:"+isEnd);
                if(!isEnd){
                        isRuned =true;
                        //判断是不是有任务做 
                        oneJob.bounds()
                        if(oneJob){
                            toast("准备执行:"+jobTag);
                            // press(oneJob.bounds().centerX(),oneJob.bounds().centerY(),3)
                            oneJob.click();
                            //进入活动页面需要时间.一般5-7秒能打开
                            sleep(7000);


                            if(!text("淘宝直播").exists()){
                                console.log("模拟向下滑动");
                                gest_down(); //向下滑动一下
                            }
                            sleep(10*1000);
                            if(!text("淘宝直播").exists()){
                                console.log("模拟向下滑动");
                                gest_down(); //向下滑动一下 
                            } 
                            sleep(10*1000);
                            if(!text("淘宝直播").exists()){
                                console.log("模拟向上滑动");
                                gest_up();
                            }
                            sleep(1*1000); 
                           
                            back();
                          
                        }
                }
        });

        if(isRuned){
            return true;
        }
    }
    return false;
}

/**
 * 设置按键监听 当脚本执行时候按音量减 退出脚本
 */
function registEvent() {
    //启用按键监听
    events.observeKey();
    //监听音量上键按下
    events.onKeyDown("KEYCODE_VOLUME_DOWN", function (event) {
        toastLog("脚本手动退出");
        exit();
    });
}

registEvent();

//整个程序是 与游戏一样的大循环. 由
//程序判断当前是什么界面.做响应操作
while(true){
    sleep(3000); //休息3秒判断
    console.log("执行大循环操作");

    //判断是不是聚划算页面
    console.log("判断是不是聚划算页面");
    if(className("android.widget.ImageView").clickable(true).depth(12).exists()){
            console.log("是聚划算页面");
            let isRedPackge = className("android.widget.ImageView").clickable(true).depth(12).findOne();
            if(isRedPackge){
                console.log("打开99每日红包页面")
                isRedPackge.click();
                toast("打开99每日红包页面");
                sleep(2000);
                continue;
            }
    }


    console.log("判断是不是淘宝首页");
    if(className("android.widget.TextView").depth(14).text("今日爆款").exists()){
        //判断是不是首页
        let isFirstPage = className("android.widget.TextView").depth(14).text("今日爆款").findOne();
        console.log("是否首页:"+isFirstPage);
        if(isFirstPage){
                press(isFirstPage.bounds().centerX(),isFirstPage.bounds().centerY(),3)
                toast("正在打开今日爆款");
                sleep(2000);
                continue;
        }
    }
   
     
    if(doingJob("浏览15秒得50星星")){
        continue;
    }
    
    if(doingJob("浏览15秒得75星星")){
        continue;
    }
         
      

     //判断是不是任务页面
     let isJobPage = className("android.widget.Image").text("TB1XiuIfiDsXe8jSZR0XXXK6FXa-621-168").findOne().parent();
     if(isJobPage){
         isJobPage.click();
         toast("打开任务列表");
         sleep(2000);
         continue;
     }
 
}


