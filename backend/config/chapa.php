<?php

return [
    'secret_key' => env('CHAPA_SECRET_KEY'),
    'webhook_secret' => env('CHAPA_WEBHOOK_SECRET'),
    'base_url' => env('CHAPA_BASE_URL', 'https://api.chapa.co/v1'),
    'callback_url' => env('APP_URL') . '/api/v1/payments/chapa/callback',
    'webhook_url' => env('APP_URL') . '/api/v1/payments/chapa/webhook',
];
