const body = JSON.parse($request.body);
if (body && body['cropId'] && body['resourceId'] && body['s']) {
    const saveCrop = $prefs.setValueForKey($request.body, 'ShopeeCrop');
    if (!saveCrop) {
        $notify('蝦蝦果園作物資料保存失敗‼️', '', '請稍後嘗試');
    } else {
        $notify('蝦蝦果園作物資料保存成功🌱', '', '');
    }
} else {
    $notify('蝦蝦果園作物資料保存失敗‼️', '', '請重新登入');
}
$done({});