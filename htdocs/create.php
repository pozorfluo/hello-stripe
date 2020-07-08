<?php

declare(strict_types=1);
require 'vendor/autoload.php';

// This is your real test secret API key.
\Stripe\Stripe::setApiKey('sk_test_51GxBXtBaAL5MTpCuXxJBzIB2JAqQtxPCV8ivS0jPWixXK1W6feqkUk6M4Hm3d7PQcVpsegEHyVFCsPe09KYAO8DY00uBBxYUe0');


function calculateOrderAmount(array $items): int
{
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // customers from directly manipulating the amount on the client
    return 1400;
}

header('Content-Type: application/json');

try {
    // retrieve JSON from POST body
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $amount = intval($json_obj['participation']) * 100;

    //   echo '<pre>'.var_export($json_obj, true).'</pre><hr />';
    $stripeParams = [
        'amount' => $amount,
        'currency' => 'usd',
    ];
    //   if (isset($json_obj[])) {}
    // $paymentIntent = \Stripe\PaymentIntent::update($stripeParams);
    $paymentIntent = \Stripe\PaymentIntent::create($stripeParams);

    $output = [
        'clientSecret' => $paymentIntent->client_secret,
        'amount' =>  $amount,
    ];

    echo json_encode($output);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
