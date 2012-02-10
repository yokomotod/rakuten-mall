<?php

require_once 'HTTP/Request2.php';

$url = "http://api.rakuten.co.jp/rws/3.0/rest?developerId=c7e107a4bd63d7ea15966c2bdaef7f75&operation=ItemSearch&version=2010-09-15&keyword=%E7%A6%8F%E8%A2%8B&sort=%2BitemPrice";
// $url = "http://api.rakuten.co.jp/rws/3.0/rest?developerId=c7e107a4bd63d7ea15966c2bdaef7f75&operation=ItemSearch&version=2010-09-15&keyword=福袋&sort=+itemPrice";
$contents = file_get_contents($url);
$contents = str_replace('header:Header', 'Header', $contents);
$contents = str_replace('itemSearch:ItemSearch', 'ItemSearch', $contents);
$contents = str_replace('xmlns:', '', $contents);
// $contents = str_replace(':', '__colone__', $contents);
$xml = simplexml_load_string($contents);

// var_dump($xml->Body->ItemSearch->Items->Item);

foreach ($xml->Body->ItemSearch->Items->Item as $item) {
  printf("<p><img src='%s'alt='%s'></p>\n", $item->mediumImageUrl, $item->itemName);
}

/*
try {
  $request = new HTTP_Request2($url, HTTP_Request2::METHOD_GET);

  // $request->setHeader("user-agent", "Uhehehe! (PHP 5.2.6)");

  $response = $request->send();

  if ($response->getStatus() == 200) {
    $body = $response->getBody();

    // あと処理をうにゃうにゃと
    // $title = @simplexml_import_dom(DOMDocument::loadHTML($body))->xpath("//head/title");
    // echo $title[0];

    echo $body;
  }
  else {
    throw new Exception ("Server returned status: " .  $response->getStatus());
  }
}
catch (HTTP_Request2_Exception $e) {
  echo $e->getMessage();
}
catch (Exception $e) {
  echo $e->getMessage();
}
*/