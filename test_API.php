<?php
header('Content-Type: text/plain');

// API URL
$url = 'https://app.canboards.com/api/check-email-status';

// Sample payload
$data = [
    'email' => 'test@example.com'
];

// Init cURL
$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: application/json',
        // Uncomment if API requires auth
        // 'Authorization: Bearer YOUR_TOKEN_HERE',
    ],
    CURLOPT_POSTFIELDS => json_encode($data),
]);

$response = curl_exec($ch);

// cURL error
if ($response === false) {
    echo "cURL ERROR:\n";
    echo curl_error($ch);
    exit;
}

// HTTP status code
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

// Output results
echo "HTTP STATUS: $httpCode\n\n";
echo "RAW RESPONSE:\n";
echo $response;
