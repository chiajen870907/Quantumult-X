let request = {
  url: '',
  headers: {
    'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
    'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    actionKey: ''
  }),
};

let missions = [
  {
    actionKey: 'act_play_bubble_game',
    missionName: '🍤 玩蝦皮泡泡王任務'
  },
  {
    actionKey: 'act_play_candy_game',
    missionName: '🍤 玩蝦皮消消樂任務'
  }
];

for (let i = 0; i < 10; i++) {
  missions.push({
    actionKey: 'act_Receive_Water',
    missionName: '🍤 收到站內朋友助水任務'
  });
}

for (let i = 0; i < 10; i++) {
  missions.push({
    actionKey: 'act_Help_Watering',
    missionName: '🍤 幫站內朋友澆水任務'
  });
}

function waterMission(index) {
  sleep(0.5);
  const now = new Date().getTime();
  const missionName = missions[index].missionName;
  const actionKey = missions[index].actionKey;
  request.url = url = 'https://games.shopee.tw/farm/api/task/action?t=' + now;
  request.body.actionKey = actionKey;

  $task.fetch(request).then(response => {
    if (response.statusCode === 200) {
      try {
        const obj = JSON.parse(data);
        if (obj.msg === 'success') {
          console.log(missions[index].missionName + '成功 ✅');
          $notify('🍤 蝦皮水滴任務', 
            missions[index].missionName, 
            '任務成功 ✅',
          );
        } else if (obj.msg === 'lock failed.') {
          $notify('🍤 蝦皮水滴任務錯誤',
            missionName,
            '連線請求過於頻繁',
          );
        } else {
          $notify('🍤 蝦皮水滴任務錯誤',
            missionName + '錯誤',
            obj.msg
          );
        }
      } catch (error) {
        $notify('🍤 蝦皮水滴任務錯誤',
          missionName + '錯誤',
          error
        );
      }
    } else {
      $notify('🍤 蝦皮 Cookie 已過期或網路錯誤‼️',
        '',
        '請重新更新 Cookie 重試 🔓'
      );
    }

    if (index < missions.length - 1) {
      waterMission(index + 1);
    }else {
      $notify('🍤 蝦皮水滴任務完成 ✅', '', '');
    }
    $done();
  }, reason => {
    $notify("🍤 蝦皮果園水滴任務打卡", "", "連線錯誤‼️");
    $done();
  });

}

function sleep(seconds) {
  const waitUntil = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() < waitUntil) true;
}

waterMission(0);