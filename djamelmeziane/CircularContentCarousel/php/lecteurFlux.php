<?php
$arrUrl = array("cdnl1516photo"=>"https://picasaweb.google.com/data/feed/base/user/117590660096025980525/albumid/6202229851688075025?alt=rss&kind=photo&hl=fr"
	,"cdnl1516data"=>"https://docs.google.com/spreadsheets/d/12M3uOcTnHHKUziA5Rhi2ygE_m6ORkBcEQ2THS6W2M4U/pub?output=csv");

curl($arrUrl[$_GET['url']]);

function curl($url){
    
	$handle = curl_init();
	curl_setopt($handle, CURLOPT_URL, $url);
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);

 // Solution temporaire - Soucis conflit ssl-https
 // source : http://unitstep.net/blog/2009/05/05/using-curl-in-php-to-access-https-ssltls-protected-sites/
    curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($handle);
    curl_close($handle);
    
    echo $response;

}
