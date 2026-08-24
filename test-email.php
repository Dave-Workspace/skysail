<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$recipient = 'canboardstoronto@gmail.com';

$configs = [

    // 1️⃣ Microsoft 365 (Best Deliverability)
    [
        'name'=>'Microsoft 365 (587 STARTTLS)',
        'host'=>'smtp.office365.com',
        'port'=>587,
        'secure'=>PHPMailer::ENCRYPTION_STARTTLS,
        'auth'=>true,
        'username'=>'info@canboards.com',
        'password'=>'N&385500915149uf'
    ],

    // 2️⃣ GoDaddy Auth SMTP
    [
        'name'=>'GoDaddy SMTP (465 SSL)',
        'host'=>'smtpout.secureserver.net',
        'port'=>465,
        'secure'=>PHPMailer::ENCRYPTION_SMTPS,
        'auth'=>true,
        'username'=>'noreply@canboards.com',
        'password'=>'N&385500915149uf'
    ],

    // 3️⃣ GoDaddy Relay (No Auth)
    [
        'name'=>'GoDaddy Relay (Port 25)',
        'host'=>'relay-hosting.secureserver.net',
        'port'=>25,
        'secure'=>false,
        'auth'=>false
    ],

    // 4️⃣ PHP mail() fallback
    [
        'name'=>'PHP mail() fallback',
        'mail'=>true
    ]
];

echo "<h2>Smart SMTP Fallback Test</h2>";

foreach ($configs as $cfg) {

    $mail = new PHPMailer(true);

    try {

        if (!empty($cfg['mail'])) {
            $mail->isMail();
        } else {

            $mail->isSMTP();
            $mail->Host = $cfg['host'];
            $mail->Port = $cfg['port'];
            $mail->SMTPAuth = $cfg['auth'];

            if ($cfg['auth']) {
                $mail->Username = $cfg['username'];
                $mail->Password = $cfg['password'];
            }

            if ($cfg['secure']) {
                $mail->SMTPSecure = $cfg['secure'];
            }

            $mail->Timeout = 3;
            $mail->SMTPAutoTLS = false;
        }

        $mail->setFrom('info@canboards.com', 'Canboards Test');
        $mail->addAddress($recipient);

        $mail->Subject = "Working Config: {$cfg['name']}";
        $mail->Body    = "This email was sent using {$cfg['name']}.";

        $mail->send();

        echo "✅ SUCCESS using: <b>{$cfg['name']}</b><br>";
        break;

    } catch (Exception $e) {
        echo "❌ Failed: {$cfg['name']} — {$mail->ErrorInfo}<br>";
    }
}
?>