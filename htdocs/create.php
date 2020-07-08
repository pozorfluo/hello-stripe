<?php

declare(strict_types=1);
require 'vendor/autoload.php';

// This is your real test secret API key.
\Stripe\Stripe::setApiKey('sk_test_51GxBXtBaAL5MTpCuXxJBzIB2JAqQtxPCV8ivS0jPWixXK1W6feqkUk6M4Hm3d7PQcVpsegEHyVFCsPe09KYAO8DY00uBBxYUe0');

header('Content-Type: application/json');

try {
    // retrieve JSON from POST body
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $amount = intval($json_obj['amount']) * 100;

    //   echo '<pre>'.var_export($json_obj, true).'</pre><hr />';
    $stripeParams = [
        'amount' => $amount,
        'currency' => 'eur',
    ];

    // $paymentIntent = \Stripe\PaymentIntent::create($stripeParams);
    if (empty($json_obj['id'] )) {
        $paymentIntent = \Stripe\PaymentIntent::create($stripeParams);
    } else {
        $paymentIntent = \Stripe\PaymentIntent::update(
            $json_obj['id'], 
            $stripeParams);
    }

    $output = [
        'id' => $paymentIntent->id,
        'clientSecret' => $paymentIntent->client_secret,
        'amount' =>  $amount,
    ];

    echo json_encode($output);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
