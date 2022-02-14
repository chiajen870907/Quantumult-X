const speedtestUrl = {
    url: 'https://www.speedtest.net/api/ios-config.php',
    method: "GET",
};

$task.fetch(speedtestUrl).then(response => {
	console.log(JSON.stringify(response))
}