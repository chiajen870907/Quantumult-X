const getSignInBundleListRequest = {
  url: 'https://games.shopee.tw/farm/api/sign_in_bundle/list?t=' + new Date().getTime(),
  method:'GET',
  headers: {
    'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
    'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
};

let claimSignInBundleRequest = {
  url: 'https://games.shopee.tw/farm/api/sign_in_bundle/claim?t=' + new Date().getTime(),
  metohs:'POST',
  headers: {
    'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
    'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    'day': 0,
    'forceClaim': true
  })
};

function getSignInBundleList() {

  $task.fetch(getSignInBundleListRequest).then(response => {
    if (response.statusCode === 200) {
      try {
        const obj = JSON.parse(data);
        const day = obj.data.day;
        const claimed = obj.data.signInBundlePrizes[day - 1].claimed;
        if (claimed) {
          console.log('🍤 蝦蝦果園今日已簽到‼️');
          // $notify('🍤 蝦蝦果園今日簽到獎勵',
          //   '',
          //   '今日已簽到‼️'
          // );
          $done();
          return;
        }
        claimSignInBundleRequest.body.day = day;
        claimSignInBundle(day);
      } catch (error) {
        $notify('🍤 蝦蝦果園獲得今日簽到獎勵列表',
          '',
          '發生錯誤‼️' + error
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
    $done();
  }, reason => {
    $notify("🍤 蝦皮果園水滴任務打卡", "", "連線錯誤‼️");
    $done();
  });

}

function claimSignInBundle() {
  $task.fetch(claimSignInBundleRequest).then(response => {
    if (response.statusCode === 200) {
      try {
        const obj = JSON.parse(data);
        if (obj.msg === 'success') {
          const day = obj.data.day;
          const prize = obj.data.signInBundlePrizes[day - 1];
          let prizeName = '';
          if (prize.prizeDetail)
          {
            prizeName = prize.prizeDetail.prizeName;
          }
          else {
            prizeName = prize.prizeNum + ' 滴水 💧';
          }
          $notify('🍤 蝦蝦果園今日簽到成功 ✅',
          '',
          '獲得 ' + prizeName
        );
        }
      } catch (error) {
        $notify('🍤 蝦蝦果園今日簽到獎勵',
          '',
          '獲得獎勵錯誤‼️' + error
        );
      }
    } else {
      $notify('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
        '',
        '請重新更新 Cookie 重試 🔓'
      );
    }
    $done();
  }, reason => {
    $notify("🍤 蝦皮果園水滴任務打卡", "", "連線錯誤‼️");
    $done();
  });

}

getSignInBundleList();