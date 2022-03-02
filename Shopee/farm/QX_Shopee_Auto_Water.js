const waterRequest = {
  url: 'https://games.shopee.tw/farm/api/orchard/crop/water?t=' + new Date().getTime(),
  method: "POST",
  headers: {
    'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
    'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: $prefs.valueForKey('ShopeeCrop'),
};
console.log(waterRequest);
console.log($prefs.valueForKey('ShopeeCrop'));
console.log(JSON.stringify($prefs.valueForKey('ShopeeCrop')));



$task.fetch(waterRequest).then(response => {
  console.log(JSON.parse(response))
  if (response.statusCode === 200) {
    try {
      const obj = JSON.parse(response);
      if (obj.msg === 'success') {
        const useNumber = obj.data.useNumber;
        const state = obj.data.crop.state;
        const exp = obj.data.crop.exp;
        const levelExp = obj.data.crop.meta.config.levelConfig[state.toString()].exp;
        const remain = levelExp - exp;
        $notify('🍤 蝦皮自動澆水成功 ✅',
          '本次澆了：' + useNumber + ' 滴水💧',
          '剩餘 ' + remain + ' 滴水成長至下一階段🌳'
        );
        $done();
      } else if (obj.msg === 'resource not enough') {
        $notify('🍤 蝦皮自動澆水',
          '',
          '水壺目前沒水‼️'
        );
        $done();
      } else if (obj.msg === 'invalid param') {
        $notify('🍤 蝦皮自動澆水',
          '',
          '種植作物錯誤，請先手動澆水一次‼️'
        );
        $done();
      } else {
        $notify('🍤 蝦皮自動澆水',
          '',
          obj.msg
        );
        $done();
      }
    } catch (error) {
      $notify('🍤 蝦皮自動澆水',
        '',
        '澆水失敗‼️' + error
      );
      $done();
    }
  } else {
    $notify('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
      '',
      '請重新更新 Cookie 重試 🔓'
    );
    $done();
  }

}, reason => {
  $notify("🍤 蝦皮簽到", "", "連線錯誤‼️")
  $done();
});
