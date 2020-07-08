<?php

declare(strict_types=1);
require 'vendor/autoload.php';

$json_str = '{"clientSecret":"pi_1H2cB5BaAL5MTpCutbWe0ODX_secret_ywMqijZYiKWbXEfePTP46hnOb","amount":5400}';
$json_obj = json_decode($json_str, true);

echo '<pre>'.var_export($json_obj, true).'</pre><hr />';

$amount = intval($json_obj['amount']) * 100;

echo '<pre>'.var_export($amount, true).'</pre><hr />';


$json_string = 'http://www.domain.com/jsondata.json';
$jsondata = file_get_contents($json_string);
$obj = json_decode($jsondata,true);
echo "<pre>";
print_r($obj);