var shopeeluckydrawUrl = {
    url: 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/a3267155f3ec89c2',
    method: "POST",
    headers: {
        'Cookie': $prefs.valueForKey("CookieSP") + ';SPC_EC=' + $prefs.valueForKey("SPC_EC") + ';',
        'X-CSRFToken': $prefs.valueForKey("CSRFTokenSP"),
        "Content-Type": "application/json",
    },
    body: {
        request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
        app_id: "E9VFyxwmtgjnCR8uhL",
        activity_code: "e37b7dec5976a29c",
        source: 0,
      },
};

$task.fetch(shopeeluckydrawUrl).then(response => {
    if (response.statusCode == 200) {
        let obj = JSON.parse(response.body);
        
        if(obj["msg"] == "no chance"){
            $notify("🍤 今日已領過蝦幣寶箱", "", "每日只能領一次‼️");
            $done();
        }else if(obj["msg" == "success"]){
            var packagename = obj["data"]["package_name"];
            $notify("🍤 蝦幣寶箱領取成功 ✅", "", "獲得 👉 " + packagename + " 💰");
            $done();
        }else if (obj["msg"] == "expired" || obj["msg"] == "event already end") {
            $notify("🍤 蝦幣寶箱活動已過期 ❌", "", "請嘗試更新模組或腳本，或等待作者更新‼️");
            $done();
        }
        $done();
    } else {
        $notify("🍤 蝦皮 Cookie 已過期‼️", "", "請重新更新 Cookie 重試 🔓");
        $done();
    }
}, reason => {
    $notify("🍤 蝦幣寶箱", "", "連線錯誤‼️")
    $done();
});