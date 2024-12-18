<?php
namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Config\JwtConfig;

class RoleFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
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

            // Periksa peran pengguna
            if (!in_array($decoded->data->role, $arguments)) {
                return service('response')->setJSON([
                    'message' => 'Forbidden: You do not have permission to access this resource'
                ])->setStatusCode(403);
            }
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