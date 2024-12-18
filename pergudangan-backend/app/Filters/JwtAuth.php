<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Config\JwtConfig;

class JwtAuth implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Allow OPTIONS requests to pass through
        if ($request->getMethod() === 'OPTIONS') {
            return;
        }

        // Ambil token dari header Authorization
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return service('response')->setJSON([
                'message' => 'Unauthorized: Missing or invalid Authorization header'
            ])->setStatusCode(401);
        }

        $token = $matches[1];

        try {
            // Verifikasi token
            $decoded = JWT::decode($token, new Key(JwtConfig::getSecretKey(), 'HS256'));

            // Simpan data user ke request agar bisa digunakan di controller
            $request->user = $decoded->data;
        } catch (\Exception $e) {
            return service('response')->setJSON([
                'message' => 'Unauthorized: ' . $e->getMessage()
            ])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Tidak perlu aksi setelah response
    }
}