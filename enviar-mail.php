<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

header('Content-Type: application/json');

// Verificar método POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["status" => "error", "message" => "Acceso denegado"]);
    exit;
}

// Recopilar datos
$nombre = strip_tags(trim($_POST['nombre'] ?? ''));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$telefono = strip_tags(trim($_POST['telefono'] ?? ''));
$espacio = strip_tags(trim($_POST['espacio'] ?? ''));
$proyecto = strip_tags(trim($_POST['proyecto'] ?? ''));

// Instancia de PHPMailer
$mail = new PHPMailer(true);

try {
    // === CONFIGURACIÓN GMAIL ===
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    
    // ------------------------------------------------------------------
    // EDITAR AQUÍ: TU GMAIL Y LA CLAVE DE 16 LETRAS
    // ------------------------------------------------------------------
    $mail->Username   = 'tucorreo@gmail.com'; 
    $mail->Password   = 'pon aqui tu clave de 16 letras'; 
    // ------------------------------------------------------------------

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    // Parche para que XAMPP no falle con los certificados SSL locales
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    // Remitente y Destinatario
    $mail->setFrom('tucorreo@gmail.com', 'Prueba Local XAMPP'); // Quien envía
    $mail->addAddress('tucorreo@gmail.com'); // A quien le llega (pon tu mismo correo para probar)
    $mail->addReplyTo($email, $nombre); // Para responderle al cliente

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = "Consulta Web: $nombre ($espacio)";
    $mail->Body    = "<h3>Nueva consulta recibida</h3>
                      <p><strong>Nombre:</strong> $nombre</p>
                      <p><strong>Email:</strong> $email</p>
                      <p><strong>Teléfono:</strong> $telefono</p>
                      <p><strong>Espacio:</strong> $espacio</p>
                      <hr>
                      <p><strong>Proyecto:</strong><br>$proyecto</p>";

    $mail->send();
    echo json_encode(["status" => "success", "message" => "¡Consulta enviada exitosamente!"]);

} catch (Exception $e) {
    http_response_code(500); // Error de servidor
    echo json_encode(["status" => "error", "message" => "Error técnico: {$mail->ErrorInfo}"]);
} ?>