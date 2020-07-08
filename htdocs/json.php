<?php

declare(strict_types=1);
require 'vendor/autoload.php';

$json_str = '{"amount":"1","id":""}';
$json_obj = json_decode($json_str, true);

echo '<pre>' . var_export($json_obj, true) . '</pre><hr />';

$amount = intval($json_obj['amount']) * 100;

echo '<pre>' . var_export($amount, true) . '</pre><hr />';

\Stripe\Stripe::setApiKey('sk_test_51GxBXtBaAL5MTpCuXxJBzIB2JAqQtxPCV8ivS0jPWixXK1W6feqkUk6M4Hm3d7PQcVpsegEHyVFCsPe09KYAO8DY00uBBxYUe0');
// \Stripe\PaymentIntent::retrieve('pi_1H2caKBaAL5MTpCuohZu0aWi_secret_FoH6D9iwZ6aFeC8lzkBSJ5ZjD');
$all = \Stripe\PaymentIntent::all();
// echo '<pre>'.var_export($all, true).'</pre><hr />';

$stripeParams = [
    'amount' => 400,
    'currency' => 'usd',
];

$paymentIntent = \Stripe\PaymentIntent::create($stripeParams);

echo '<pre>' . var_export($paymentIntent->id, true) . '</pre><hr />';
