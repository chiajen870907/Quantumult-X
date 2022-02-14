if ($request.headers['Cookie']) {
    var shopee_token = $request.headers['Cookie'].split('shopee_token=')[1].split(';')[0];
    var cookie = $prefs.setValueForKey(shopee_token, "ShopeeToken");
    if (!cookie) {
        $notify("🍤 蝦皮 Token 保存錯誤‼️", "", "請重新登入")
        
    } else {
        $notify("🍤 蝦皮 Token 保存成功🎉", "", "")
    }
} else {
    $notify("🍤 蝦皮 Token 保存失敗‼️", "", "請重新登入")
}
$done({})