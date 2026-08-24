<?php
//require_once __DIR__ . '/../lib/Security.php';
//require_once __DIR__ . '/../lib/ApiClient.php';

//Security::csrfCheck();

//$data = json_decode(file_get_contents("php://input"), true);

//$email = $data['email'] ?? '';
//$password = $data['password'] ?? '';

//$response = ApiClient::post('login', [
//    'email'    => $email,
//    'password'=> $password   // Sent over HTTPS
//]);

//$result = json_decode($response, true);

//if (!empty($result['success'])) {
//    session_start();
//    $_SESSION['user'] = $email;
//    echo json_encode(['success' => true]);
//} else {
//    echo json_encode(['success' => false]);
//}


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../config/db.php'; // defines $pdo
require_once __DIR__ . '/../lib/Security.php';
require_once __DIR__ . '/../lib/ApiClient.php';
Security::csrfCheck();

/* --- MODE FLAG --- */
// Set to 'dummy_positive', 'dummy_negative', or 'real'
$login_mode = 'real'; 

/* RATE LIMIT: 5 attempts per IP per 10 min */
$ip = $_SERVER['REMOTE_ADDR'];
$time = time();
if(!isset($_SESSION['login_attempts'][$ip])) $_SESSION['login_attempts'][$ip] = [];
$_SESSION['login_attempts'][$ip] = array_filter($_SESSION['login_attempts'][$ip], fn($t)=> $t>$time-600);
if(count($_SESSION['login_attempts'][$ip])>=5){
    echo json_encode(['success'=>false,'message'=>'Too many login attempts. Try again later.']);
    exit;
}
$_SESSION['login_attempts'][$ip][] = $time;

/* --- Get input --- */
$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if ($email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Email and password required']);
    exit;
}

switch($login_mode){

    case 'dummy_positive':
        $response = [
            'success' => true,
            'user' => [
                'id' => 1,
                'name' => 'Test User',
                'email' => $email ?: 'test@example.com',
                'is_admin' => 0,
                'is_verified' => 1
            ],
            'message' => 'Login successful (dummy positive)'
        ];
        // Set session
        $_SESSION['user_id'] = $response['user']['id'];
        $_SESSION['user_name'] = $response['user']['name'];
        $_SESSION['is_admin'] = $response['user']['is_admin'];
       
        echo json_encode(['success' => true, 'message' => 'Dummy login success']);
        exit;

    case 'dummy_negative':
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;

    case 'real':
        $response_json = ApiClient::post('login', ['email'=>$email,'password'=>$password]);
        $response = json_decode($response_json, true);

        //if (empty($response['success'])) {
        if (!isset($response['user'])) {
            echo json_encode($response);
            exit;
        }

        if (!empty($response['user'])) {
            $_SESSION['user_id'] = $response['user']['id'];
            $_SESSION['email']   = $response['user']['email'];
            $_SESSION['is_admin'] = 0;
            // optional
            $_SESSION['name'] = $response['user']['name'];
        } else {
            // login failed
            $_SESSION = [];
        }


        /* --- LOCAL USER CHECK --- */
        // $stmt = $pdo->prepare("SELECT id, is_admin FROM users WHERE email = ?");
        // $stmt->execute([$email]);
        // $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // if ($user) {
        //     // Existing user
        //     $userId = $user['id'];
        //     $isAdmin = (int)$user['is_admin'];
        // } else {
        //     // New user
        //     $hash = password_hash($password, PASSWORD_DEFAULT);
        //     $stmt = $pdo->prepare("
        //         INSERT INTO users (email, password, is_admin, is_verified, created_at)
        //         VALUES (?, 0, 1, NOW())
        //     ");
        //     $stmt->execute([$email, $hash]);

        //     $userId = $pdo->lastInsertId();
        //     $isAdmin = 0;
        // }

        //  /* --- SESSION INIT --- */
        // $_SESSION['user_id'] = $userId;
        // $_SESSION['email'] = $email;
        // $_SESSION['is_admin'] = $isAdmin;

        echo json_encode($response);
        exit;

        // if(!empty($response['success']) && $response['success']){

        //     // Check if email already exists
        //     $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        //     $stmt->execute([$email]);
        //     if ($stmt->rowCount() > 0) {
        //         $_SESSION['user_id'] = $response['user']['id']; // id from query
        //         $_SESSION['email'] = $email;
        //         $_SESSION['is_admin'] = 0;
        //         //echo json_encode(['success' => false, 'message' => 'Email already exists']);
        //         //exit;
        //         break;
        //     }

        //     // Insert new admin
        //     $hash = password_hash($password, PASSWORD_DEFAULT);
        //     $insertStmt = $pdo->prepare("
        //         INSERT INTO users (email, is_admin, is_verified, created_at)
        //         VALUES ( ?, 0, 1, NOW())
        //     ");
        //     $insertStmt->execute([$email]);

        //     $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        //     $stmt->execute([$email]);
        //     if ($stmt->rowCount() > 0) {
        //         $_SESSION['user_id'] = $response['user']['id']; // id from query
        //         $_SESSION['email'] = $email;
        //         $_SESSION['is_admin'] = 0;
        //         break;
        //     }
        //     // $_SESSION['user_id'] = $response['user']['id'];
        //     // $_SESSION['user_name'] = $response['user']['name'];
        //     // $_SESSION['email'] = $response['user']['email'];
        //     // $_SESSION['is_admin'] = $response['user']['is_admin'];
        // }
        // break;

    default:
        echo json_encode(['success' => false, 'message' => 'Invalid login mode']);
        exit;
}

//echo json_encode($response);
