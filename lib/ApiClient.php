<?php
require_once __DIR__ . '/../config/config.php';

class ApiClient {

    public static function post($endpoint, $payload) {
        $ch = curl_init(API_BASE_URL . $endpoint);

        curl_setopt_array($ch, [
            CURLOPT_POST            => true,
            CURLOPT_RETURNTRANSFER  => true,
            CURLOPT_HTTPHEADER      => [
                'Content-Type: application/json',
                'X-API-KEY: ' . API_KEY
            ],
            CURLOPT_POSTFIELDS      => json_encode($payload)
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
    }
}
