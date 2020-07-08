<?php

require 'vendor/autoload.php';

// This is your real test secret API key.
\Stripe\Stripe::setApiKey('sk_test_51GxBXtBaAL5MTpCuXxJBzIB2JAqQtxPCV8ivS0jPWixXK1W6feqkUk6M4Hm3d7PQcVpsegEHyVFCsPe09KYAO8DY00uBBxYUe0');


function calculateOrderAmount(array $items): int {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // customers from directly manipulating the amount on the client
  return 1400;
}

header('Content-Type: application/json');

try {
  // retrieve JSON from POST body
  $json_str = file_get_contents('php://input');
  $json_obj = json_decode($json_str);

  $amount = intval($json_obj->items[0]->participation) * 100;

//   echo '<pre>'.var_export($json_obj, true).'</pre><hr />';
  $paymentIntent = \Stripe\PaymentIntent::create([
    'amount' => $amount,
    'currency' => 'usd',
  ]);

  $output = [
    'clientSecret' => $paymentIntent->client_secret,
    'data' =>  $amount,
  ];

  echo json_encode($output);
} catch (Error $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}