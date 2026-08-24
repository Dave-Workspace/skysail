<?php
//require_once __DIR__ . '/../lib/Security.php';
//require_once __DIR__ . '/../lib/ApiClient.php';

//Security::csrfCheck();

//$data = json_decode(file_get_contents("php://input"), true);

/* PASSWORD POLICY */
//if (!preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/', $data['password'])) {
//    echo json_encode(['success'=>false,'message'=>'Weak password']);
//    exit;
//}

/* VERIFY reCAPTCHA */
//$secret = 'YOUR_SECRET_KEY';
//$verify = file_get_contents(
//    "https://www.google.com/recaptcha/api/siteverify?secret=$secret&response=".$data['captcha']
//);
//$captchaSuccess = json_decode($verify, true);

//if (!$captchaSuccess['success']) {
//    echo json_encode(['success'=>false,'message'=>'Captcha failed']);
//    exit;
//}

/* SEND TO EXTERNAL SYSTEM */
//$response = ApiClient::post('register', [
//    'name' => $data['name'],
//    'contact' => $data['contact'],
//    'email' => $data['email'],
//    'password' => $data['password']
//]);

//echo $response;


if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../config/db.php'; // defines $pdo

require_once __DIR__ . '/../lib/Security.php';
require_once __DIR__ . '/../lib/ApiClient.php';
Security::csrfCheck();

/* RATE LIMIT: 10 attempts per IP per 1 hour */
$ip = $_SERVER['REMOTE_ADDR'];
$time = time();
if(!isset($_SESSION['register_attempts'][$ip])) $_SESSION['register_attempts'][$ip]=[];
$_SESSION['register_attempts'][$ip] = array_filter($_SESSION['register_attempts'][$ip], fn($t)=> $t>$time-3600);
if(count($_SESSION['register_attempts'][$ip])>=10){
    echo json_encode(['success'=>false,'message'=>'Too many registration attempts. Try later.']);
    exit;
}
$_SESSION['register_attempts'][$ip][]=$time;

/* PASSWORD POLICY */
$data = json_decode(file_get_contents("php://input"),true);

$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$password= $data['password'] ?? '';
$contact = $data['contact'] ?? '';
$country = $data['countryCode'] ?? '';

if ($name === '' || $email === '' || $password === '') {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}


if(!preg_match('/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/',$data['password'])){
    echo json_encode(['success'=>false,'message'=>'Weak password']);
    exit;
}

/* --- CHECK LOCAL DUPLICATE --- */
// $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
// $stmt->execute([$email]);

// if ($stmt->fetch()) {
//     echo json_encode(['success' => false, 'message' => 'Email already registered']);
//     exit;
// }

/* CAPTCHA check omitted for brevity - same as before */

/* SEND TO EXTERNAL SYSTEM */
$response_json = ApiClient::post('register',[
    'full_name'=>$data['name'],
    'contact_no'=>$data['contact'],
    'contact_no_country'=>$data['countryCode'],
    'email'=>$data['email'],
    'password'=>$data['password']
    //,'captcha'=>$data['captcha']
]);
//echo $response;

$response = json_decode($response_json, true);

// if (empty($response['success'])) {
//     echo json_encode($response);
//     exit;
// }

// API success (registration email sent)
if (isset($response['message']) && $response['message'] === 'verification mail sent') {
    echo json_encode([
        'success' => true,
        'message' => $response['message']
    ]);
    exit;
}

// API validation error (email already taken, etc.)
if (isset($response['errors'])) {
    echo json_encode([
        'success' => false,
        'message' => $response['message'] ?? 'Validation error',
        'errors'  => $response['errors']
    ]);
    exit;
}


// Any other unexpected API response
echo json_encode([
    'success' => false,
    'message' => 'Registration failed. Please try again.'
]);
exit;


/* --- LOCAL DB INSERT --- */
// try {
//     $pdo->beginTransaction();

//     $hash = password_hash($password, PASSWORD_DEFAULT);

//     $insertStmt = $pdo->prepare("
//         INSERT INTO users (name, email, password, is_admin, created_at)
//         VALUES (?, ?, ?, 0, NOW())
//     ");
//     $insertStmt->execute([$name, $email, $hash]);

//     $userId = $pdo->lastInsertId();

//     $pdo->commit();

// } catch (Exception $e) {
//     $pdo->rollBack();
//     //echo json_encode(['success' => false, 'message' => 'Registration failed locally']);
//     exit;
// }

// echo json_encode($response);
