console.log("flag");
const luckyRrawGetIdRequest = {
    url: 'https://games.shopee.tw/gameplatform/api/v1/game/activity/e37b7dec5976a29c/settings?appid=E9VFyxwmtgjnCR8uhL&basic=false',
    method: "GET",
	headers: {
        'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
        'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
    },
};
console.log("flag1");
let luckyRrawRequest = {
    url: 'https://games.shopee.tw/luckydraw/api/v1/lucky/event/15d3b075799e64b2',
	method: "POST",
    headers: {
        'Cookie': $prefs.valueForKey('CookieSP') + ';SPC_EC=' + $prefs.valueForKey('SPC_EC') + ';',
        'X-CSRFToken': $prefs.valueForKey('CSRFTokenSP'),
    },
	body:JSON.stringify({
        request_id: (Math.random() * 10 ** 20).toFixed(0).substring(0, 16),
		app_id: 'E9VFyxwmtgjnCR8uhL',
        activity_code: 'e37b7dec5976a29c',
        source: 0,
    }),

};
console.log("flag2");


