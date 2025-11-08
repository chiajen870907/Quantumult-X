(function() {
  // 取得 response headers 與 request host
  const headers = $response && $response.headers ? $response.headers : {};
  const req = $request || {};
  const host = (req && req.url) ? (new URL(req.url)).hostname : 'unknown';
  const key = `qx_cookie_${host}`;

  // 收集所有 Set-Cookie header 值（支援大小寫）
  console.log('Response Headers:', headers);
  const cookieHeaders = [];
  Object.keys(headers).forEach(k => {
    if (/^set-cookie$/i.test(k)) {
      const v = headers[k];
      if (Array.isArray(v)) {
        v.forEach(x => cookieHeaders.push(x));
      } else {
        cookieHeaders.push(v);
      }
    }
  });

  if (cookieHeaders.length === 0) {
    // 沒有 Set-Cookie，直接結束
    $done({headers});
    return;
  }

  // 解析 single Set-Cookie 字串 -> {name, value, attrs: {Path, Expires,...}, raw}
  function parseSetCookie(sc) {
    const parts = sc.split(';').map(p=>p.trim());
    const [nameValue, ...attrs] = parts;
    const eq = nameValue.indexOf('=');
    const name = eq>-1 ? nameValue.slice(0,eq) : nameValue;
    const value = eq>-1 ? nameValue.slice(eq+1) : '';
    const attrObj = {};
    attrs.forEach(a=>{
      const [k, ...rest] = a.split('=');
      const K = k.trim();
      const V = rest.length ? rest.join('=').trim() : true;
      attrObj[K] = V;
    });
    return {name, value, attrs: attrObj, raw: sc};
  }

  // 取出既有儲存（若有），並合併更新
  let storeStr = $prefs.valueForKey(key);
  let store = {};
  try { store = storeStr ? JSON.parse(storeStr) : {}; } catch(e){ store = {}; }

  cookieHeaders.forEach(sc => {
    try {
      const parsed = parseSetCookie(sc);
      // 若 value 為 'deleted' 或 Expires 過期，將從 store 中移除
      const isDeleted = parsed.value === 'deleted' || (parsed.attrs && parsed.attrs.Expires && (new Date(parsed.attrs.Expires) < new Date()));
      if (isDeleted) {
        delete store[parsed.name];
      } else {
        // 儲存完整資訊（你也可以只存 name:value）
        store[parsed.name] = {
          value: parsed.value,
          attrs: parsed.attrs,
          lastUpdate: (new Date()).toISOString(),
          raw: parsed.raw
        };
      }
    } catch(e){
      // 解析失敗就跳過
    }
  });

  // 儲存回 prefs（BoxJS 可讀）
  $prefs.setValueForKey(JSON.stringify(store), key);
  $notify('QX Cookie', `Saved ${Object.keys(store).length} cookies for ${host} \n ${JSON.stringify(store, null, 2)}`, '');
  console.log(`QX Cookie: Saved ${Object.keys(store).length} cookies for ${host}`);
  console.log(JSON.stringify(store, null, 2));
  $done({headers});
})();
