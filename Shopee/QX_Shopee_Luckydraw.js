const luckyRrawGetIdRequest = {
	url: 'https://games.shopee.tw/gameplatform/api/v1/game/activity/e37b7dec5976a29c/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false',
	method: "GET",
	headers: {
		'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
		'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
	},
};

let luckyRrawRequest = {
	url: 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/15d3b075799e64b2',
	method: "POST",
	headers: {
		'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
		'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
	},
	body: JSON.stringify({
		request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
		app_id: 'E9VFyxwmtgjnCR8uhL',
		activity_code: 'e37b7dec5976a29c',
		source: 0
	}),
};

function luckyDrawGetId() {
	$task.fetch(luckyRrawGetIdRequest).then(response => {
		if (response.statusCode === 200) {
			const obj = JSON.parse(response.body);
			if (obj['msg'] !== 'success') {
				$notify('🍤 蝦幣寶箱網址查詢', '', '未知錯誤，請稍候再手動嘗試‼️');
				$done();
			} else {
				const eventUrl = obj['data']['basic']['event_code'];
				luckyRrawRequest.url = 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/' + eventUrl;
				console.log('🍤 蝦幣寶箱新網址獲取成功： ' + luckyRrawRequest.url);
				// 開寶箱
				luckyDraw();
				// console.log("task fetch");
				// $task.fetch(luckyRrawRequest).then(response => {
				// 	console.log("task fetch......")
				// 	console.log(response.statusCode);
				// 	if (response.statusCode == 200) {
				// 		const obj = JSON.parse(response.body);
				// 		console.log(obj);
				// 		if (obj['msg'] == 'no chance') {
				// 			$notify('🍤 今日已領過蝦幣寶箱', '', '每日只能領一次‼️');
				// 		} else if (obj['msg'] == 'success') {
				// 			const packagename = obj['data']['package_name'];
				// 			$notify('🍤 蝦幣寶箱領取成功 ✅', '', '獲得 👉 ' + packagename + ' 💎');
				// 		} else if (obj['msg'] == 'expired' || obj['msg'] == 'event already end') {
				// 			$notify('🍤 蝦幣寶箱活動已過期 ❌', '', '請嘗試更新模組或腳本，或等待作者更新‼️');
				// 		} else {
				// 			$notify('🍤 未知錯誤 ❌', '', '請嘗試更新模組或腳本，或等待作者更新‼️');
				// 		}
				// 	} else {
				// 		$notify('🍤 蝦皮 Cookie 已過期‼️', '', '請重新抓取 🔓');
				// 	}
				// 	$done();
			
				// }, reason => {
				// 	$notify("🍤 蝦幣寶箱網址查詢", "", "連線錯誤‼️");
				// 	$done();
				// });
			}
		} else {
			$notify('🍤 蝦皮 Cookie 已過期‼️', '', '請重新抓取 🔓');
			$done();
		}
		$done();

	}, reason => {
		$notify("🍤 蝦幣寶箱網址查詢", "", "連線錯誤‼️")
		$done();
	});
}

function luckyDraw() {
	console.log("luckyDraw()");
	console.log(JSON.parse(luckyRrawRequest));
	$task.fetch(luckyRrawRequest).then(response => {
		console.log("*****************************************************")
		console.log(response);
		if (response.statusCode === 200) {
			const obj = JSON.parse(response.body);
			console.log(obj);
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
			} else {
				$notify('🍤 未知錯誤 ❌', '', '請嘗試更新模組或腳本，或等待作者更新‼️');
				$done();
			}
			$done();
		} else {
			$notify("🍤 蝦皮 Cookie 已過期或網路錯誤‼️", "", "請重新更新 Cookie 重試 🔓");
			$done();
		}
	}, reason => {
		$notify("🍤 蝦皮簽到", "", "連線錯誤‼️")
		$done();
	});

}

luckyDrawGetId();