const shopeeCookie = $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';';
const shopeeCSRFToken = $prefs.valueForKey('CSRFTokenSP');
const shopeeHeaders = {
  'Cookie': shopeeCookie,
  'X-CSRFToken': shopeeCSRFToken,
};

const shippingLuckyRrawGetIdRequest = {
  url: 'https://games.shopee.tw/gameplatform/api/v1/game/activity/6cbacc8fa4a62749/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false',
  method:'GET',
  headers: shopeeHeaders,
};

let shippingLuckyRrawGetDailyChanceRequest = {
  url: '',
  method:'GET',
  headers: shopeeHeaders,
}

let shippingLuckyRrawRequest = {
  url: '',
  method:'POST',
  headers: shopeeHeaders,
  body: {
    schedule_ldc_id: 0,
    request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
    app_id: 'E9VFyxwmtgjnCR8uhL',
    activity_code: '6cbacc8fa4a62749',
    source: 0,
  },
};

// 獲得免運寶箱 ID
function shippingLuckyDrawGetId() {
  $httpClient.get(shippingLuckyRrawGetIdRequest, function (error, response, data) {
    if (error) {
      $notify('🍤 蝦幣免運寶箱網址查詢',
        '',
        '連線錯誤‼️'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const eventUrl = obj.data.basic.event_code;
            let module_id = 0;
            for (const item of obj.data.modules) {
              if (item.module_name === 'Service.LUCKY_DRAW_COMPONENT') {
                module_id = item.module_id;
                break;
              } 
            }
            shippingLuckyRrawGetDailyChanceRequest.url = 'https://games.shopee.tw/gameplatform/api/v1/chance/35651/event/' + eventUrl + '/query?appid=E9VFyxwmtgjnCR8uhL&basic=false'
            shippingLuckyRrawRequest.url = 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/' + eventUrl;
            shippingLuckyRrawRequest.body.schedule_ldc_id = module_id;
            console.log('🍤 蝦幣免運寶箱新網址獲取成功： ' + shippingLuckyRrawRequest.url + ' Module Id: ' + module_id);
            // $notify('🍤 蝦幣免運寶箱新網址獲取成功： ', 
            //   '', 
            //   shippingLuckyRrawRequest.url
            // );
            shippingLuckyDrawGetChance();
          } else {
            $notify('🍤 蝦幣免運寶箱網址查詢錯誤',
              '',
              obj.msg
            );
            $done();
          }
        } catch (error) {
          $notify('🍤 蝦幣免運寶箱網址查詢錯誤',
            '',
            error
          );
          $done();
        }
      } else {
        $notify('🍤 蝦皮 Cookie 已過期‼️',
          '',
          '請重新抓取 🔓'
        );
        $done();
      }
    }
  });
}

function shippingLuckyDrawGetChance() {
  $httpClient.get(shippingLuckyRrawGetDailyChanceRequest, function (error, response, data) {
    if (error) {
      $notify('🍤 免運寶箱',
        '',
        '連線錯誤‼️'
      );
      $done();
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.data.daily_chance > 0) {
            shippingLuckyDraw();
          }
          else {
            console.log('🍤 今日已領過免運寶箱，每日只能免費領一次‼️');
            $notify('🍤 今日已領過免運寶箱',
              '',
              '每日只能免費領一次‼️'
            );
          }
          $done();
        }
        catch (error) {
          $notify('🍤 免運寶箱領取錯誤‼️',
            '',
            error
          );
          $done();
        }
      } else {
        $notify('🍤 蝦皮 Cookie 已過期‼️',
          '',
          '請重新抓取 🔓'
        );
        $done();
      }
    }
  });
}

function shippingLuckyDraw() {
  $httpClient.post(shippingLuckyRrawRequest, function (error, response, data) {
    if (error) {
      $notify('🍤 免運寶箱',
        '',
        '連線錯誤‼️'
      );
    } else {
      if (response.status === 200) {
        try {
          const obj = JSON.parse(data);
          if (obj.msg === 'success') {
            const packageName = obj.data.package_name;
            $notify('🍤 免運寶箱領取成功 ✅',
              '',
              '獲得 👉 ' + packageName + ' 💎'
            );
          } else if (obj.msg === 'expired' || obj.msg === 'event already end') {
            $notify('🍤 免運寶箱活動已過期 ❌',
              '',
              '請嘗試更新模組或腳本，或等待作者更新‼️'
            );
          }
        }
        catch (error) {
          $notify('🍤 免運寶箱領取錯誤‼️',
            '',
            error
          );
        }
      } else {
        $notify('🍤 蝦皮 Cookie 已過期‼️',
          '',
          '請重新抓取 🔓'
        );
      }
    }
    $done();
  });
}

shippingLuckyDrawGetId();