var speedtestUrl = {
    url: 'https://www.speedtest.net/api/ios-config.php',
    method: "GET",
};

$task.fetch(speedtestUrl){$done();}

