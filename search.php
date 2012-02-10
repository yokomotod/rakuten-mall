<?php

require_once 'HTTP/Request2.php';

$url = "http://api.rakuten.co.jp/rws/3.0/rest?developerId=c7e107a4bd63d7ea15966c2bdaef7f75&operation=ItemSearch&version=2010-09-15&keyword=%E7%A6%8F%E8%A2%8B&sort=%2BitemPrice";
// $url = "http://api.rakuten.co.jp/rws/3.0/rest?developerId=c7e107a4bd63d7ea15966c2bdaef7f75&operation=ItemSearch&version=2010-09-15&keyword=ЪЁТо&sort=+itemPrice";
$contents = file_get_contents($url);


$contents = str_replace('header:Header', 'Header', $contents);
$contents = str_replace('itemSearch:ItemSearch', 'ItemSearch', $contents);
$contents = str_replace('xmlns:', '', $contents);
// $contents = str_replace(':', '__colone__', $contents);

echo $contents;

/*
$xml = simplexml_load_string($contents);

// var_dump($xml->Body->ItemSearch->Items->Item);

foreach ($xml->Body->ItemSearch->Items->Item as $item) {
  printf("<p><img src='%s'alt='%s'></p>\n", $item->mediumImageUrl, $item->itemName);
}
*/