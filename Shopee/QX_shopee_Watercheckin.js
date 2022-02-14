const now = new Date().getTime();

const shopeewUrl = {
    url: "https://games.shopee.tw/farm/api/task/action?t=" + now,
    headers: {
      'Cookie': $prefs.valueForKey("CookieSP") + ';SPC_EC=' + $prefs.valueForKey("SPC_EC") + ';',
      'X-CSRFToken':$prefs.valueForKey("CSRFTokenSP"),
      "Content-Type": "application/json",
    },
    body: { actionKey: "act_Check_In" },
};

$task.fetch(shopeewUrl).then(response => {
    console.log(response.statusCode)
    if (response.statusCode == 200) {
        let obj = JSON.parse(response.body);
        console.log(obj)
        if (obj["msg"] == "success") {
            $notify("🍤 蝦皮果園", "", "水滴任務打卡成功 ✅");
            $done();
        }else if(obj["msg"] == "false"){
            $notify("🍤 今日已經完成所有水滴任務打卡", "", "每日只能打卡三次‼️");
            $done();
        }else{
            $notify("🍤 蝦皮果園水滴任務錯誤", "", "錯誤訊息" + obj["msg"])
            $done();
        }
        $done();
    } else {
        $notify("🍤 蝦皮 Cookie 已過期或網路錯誤‼️", "", "請重新更新 Cookie 重試 🔓");
        $done();
    }
}, reason => {
    
    $notify("🍤 蝦皮果園水滴任務打卡", "", "連線錯誤‼️");
    $done();
});