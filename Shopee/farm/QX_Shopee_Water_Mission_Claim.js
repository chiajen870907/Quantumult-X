const getListRequest = {
  url: 'https://games.shopee.tw/farm/api/task/listV2?t=' + new Date().getTime(),
  method: "GET",
  headers: JSON.stringify({
    'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
    'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
    'Content-Type': 'application/json',
  }),
};

let claimRewardRequest = {
  url: 'https://games.shopee.tw/farm/api/task/reward/claim?t=' + new Date().getTime(),
  method: "POST",
  headers: {
    'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
    'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "taskId": null,
    "taskFinishNum": 1,
    "isNewUserTask": false,
    "forceClaim": false,
  }),
};

let claims = [];

function getRewardList() {
  $task.fetch(getListRequest).then(response => {
    if (response.statusCode === 200) {
      try {
        const obj = JSON.parse(data);
        const taskGroups = obj.data.userTasks;
        for (let i = 0; i < taskGroups.length; i++) {
          const taskList = taskGroups[i];
          for (let j = 0; j < taskList.length; j++) {
            const task = taskList[j];
            const taskId = task.taskInfo.Id;
            const taskName = task.taskInfo.taskName;
            claimRewardRequest.body.taskId = taskId;
            if (task.canReward === true) {
              claims.push({
                taskId: taskId,
                taskName: taskName
              });
            }
          }
        }
        // 獲得列表完畢，執行領取
        if (claims.length) {
          claimReward(0);
        }
        else {
          console.log('🍤 蝦蝦果園沒有可領取的任務獎勵‼️');
          $notify('🍤 蝦蝦果園任務列表',
            '',
            '沒有可領取的任務獎勵‼️'
          );
          $done();
        }
      } catch (error) {
        $notify('🍤 蝦蝦果園任務列表',
          '',
          '獲得任務錯誤‼️' + error
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
    $notify("🍤 蝦蝦果園任務列表", "", "連線錯誤‼️");
    $done();
  });
}

function claimReward(index) {
  sleep(0.5);
  const taskId = claims[index].taskId;
  const taskName = claims[index].taskName;
  claimRewardRequest.body.taskId = taskId;

  $task.fetch(claimRewardRequest).then(response => {
    if (response.statusCode === 200) {
      try {
        const obj = JSON.parse(data);
        if (obj.msg === 'success') {
          console.log('🍤 蝦蝦果園任務 ' + taskName + ' 領取成功 ✅');
          $notify('🍤 蝦蝦果園任務', taskName, '自動領取水滴成功',);
        } else {
          $notify('🍤 蝦蝦果園任務 ',taskName,' 自動領取錯誤' + obj.msg + '‼️');
        }
      } catch (error) {
        $notify('🍤 蝦蝦果園任務 ',taskName,' 自動領取錯誤‼️');
      }
    } else {
      $notify('🍤 蝦皮 Cookie 已過期或網路錯誤‼️','','請重新更新 Cookie 重試 🔓');
    }
    $done();
  }, reason => {
    $notify("🍤 蝦蝦果園任務列表", "", "連線錯誤‼️");
    $done();
  });
}

function sleep(seconds) {
  const waitUntil = new Date().getTime() + seconds * 1000;
  while (new Date().getTime() < waitUntil) true;
}

getRewardList();