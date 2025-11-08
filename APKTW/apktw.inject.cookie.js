// inject_cookie.js
// Quantumult X request-header 腳本
// 會把 prefs 裡 qx_cookie_<host> 的 cookies 組成 Cookie header 注入請求

(function() {
  const req = $request || {};
  const url = req.url || '';
  const host = (url) ? (new URL(url)).hostname : 'unknown';
  const key = `qx_cookie_${host}`;

  let storeStr = $prefs.valueForKey(key);
  if (!storeStr) {
    $done({request: $request});
    return;
  }

  let store = {};
  try { store = JSON.parse(storeStr); } catch(e){ store = {}; }

  // 組成 Cookie header 的 name=value 清單（過濾掉 value === undefined）
  const kvs = Object.keys(store).map(n => {
    const v = store[n] && store[n].value ? store[n].value : '';
    return `${n}=${v}`;
  }).filter(x => x && x.indexOf('=')>-1);

  if (kvs.length === 0) {
    $done({request: $request});
    return;
  }

  const cookieHeader = kvs.join('; ');
  // 覆寫/加入 Cookie header
  $request.headers['Cookie'] = cookieHeader;

  // 若需要也可以加其它 header
  // $request.headers['User-Agent'] = '...';

  $done({request: $request});
})();
