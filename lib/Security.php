<?php
class Security {

    public static function csrfCheck() {
        //$headers = getallheaders();
        $headers = array_change_key_case(getallheaders(), CASE_UPPER);
        if (!isset($headers['X-CSRF-TOKEN'])) {
            self::forbidden();
        }

        require_once __DIR__ . '/../config/csrf.php';

        if (!validateCsrfToken($headers['X-CSRF-TOKEN'])) {
            self::forbidden();
        }
    }

    public static function forbidden() {
        http_response_code(403);
        echo json_encode(['error' => 'Forbidden']);
        exit;
    }
}
