const luckyRrawGetIdRequest = {
    url: 'https://games.shopee.tw/gameplatform/api/v1/game/activity/e37b7dec5976a29c/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false',
    method: "GET",
	headers: {
        'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
        'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    },
}

let luckyRrawRequest = {
    url: 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/15d3b075799e64b2',
	method: "POST",
    headers: {
        'Cookie': $persistentStore.read('CookieSP') + ';SPC_EC=' + $persistentStore.read('SPC_EC') + ';',
        'X-CSRFToken': $persistentStore.read('CSRFTokenSP'),
    },
    body: {
        request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
        app_id: 'E9VFyxwmtgjnCR8uhL',
        activity_code: 'e37b7dec5976a29c',
        source: 0,
    },
};




$task.fetch(luckyRrawGetIdRequest).then(response => {
    if (response.statusCode == 200) {
		const obj = JSON.parse(data);
            if (obj['msg'] !== 'success') {
                $notification.post('🍤 蝦幣寶箱網址查詢', '', '未知錯誤，請稍候再手動嘗試‼️');
            } else {
                const eventUrl = obj['data']['basic']['event_code'];
                luckyRrawRequest.url = 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/' + eventUrl;
                console.log('🍤 蝦幣寶箱新網址獲取成功： ' + luckyRrawRequest.url);
                // 開寶箱

				$task.fetch(luckyRrawRequest).then(response => {
					if (response.status == 200) {
						const obj = JSON.parse(data);
						if (obj['msg'] == 'no chance') {
							$notify('🍤 今日已領過蝦幣寶箱', '', '每日只能領一次‼️');
							$done();
						} else if (obj['msg'] == 'success') {
							const packagename = obj['data']['package_name'];
							$notify('🍤 蝦幣寶箱領取成功 ✅', '', '獲得 👉 ' + packagename + ' 💎');
							$done();
						} else if (obj['msg'] == 'expired' || obj['msg'] == 'event already end') {
							$notify('🍤 蝦幣寶箱活動已過期 ❌', '', '請嘗試更新模組或腳本，或等待作者更新‼️');
							$done();
						}
					} else {
						$notify('🍤 蝦皮 Cookie 已過期‼️', '', '請重新抓取 🔓');
						$done();
					}
				}, reason => {
					$notify('🍤 蝦幣寶箱', '', '連線錯誤‼️'))
					$done();
				});
				
			}
}, reason => {
    $notify("🍤 蝦幣寶箱網址查詢", "", "連線錯誤‼️")
    $done();
});