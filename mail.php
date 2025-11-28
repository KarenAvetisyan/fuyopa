<?php
// Настройки
$to = "fuyopia@ro.ru";  
$from = "info@example.com"; 
$fromName = "Новая заявка Fuyopia"; 

// Массив полей формы и их подписи для письма
$fields = [
    'name'          => 'Имя',
    'email'         => 'Email',
    'phone'         => 'Телефон',
    'connect_email' => 'Связь по Email',
    'connect_phone' => 'Связь по телефону'
];

$message = "Новая заявка с сайта:\r\n\r\n";

// Перебор полей и формирование текста письма
foreach ($fields as $key => $label) {
    if (!empty($_POST[$key])) {
        // Для чекбоксов выводим "Да" вместо значения
        $value = ($key === 'connect_email' || $key === 'connect_phone') ? 'Да' : htmlspecialchars(trim($_POST[$key]), ENT_QUOTES, 'UTF-8');
        $message .= "$label: $value\r\n";
    }
}

// Тема письма (используем URL страницы, если доступен)
$page = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Сайт';
$subject = "Новая заявка ($page)";

// Кодировка темы письма в UTF-8
$subject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

// Заголовки письма
$headers = "From: " . mb_encode_mimeheader($fromName, "UTF-8") . " <$from>\r\n";
$headers .= "Reply-To: $from\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Отправка письма
if (mail($to, $subject, $message, $headers)) {
    echo "Ваше сообщение отправлено, спасибо!";
} else {
    echo "Ошибка при отправке письма.";
}
?>
