<?php

namespace App\Controllers;

use App\Config\JwtConfig;
use App\Models\UserModel;
use App\Models\RefreshTokenModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends ResourceController
{
    protected $userModel;
    protected $refreshTokenModel;
    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->refreshTokenModel = new RefreshTokenModel();
    }
    public function create()
    {
        // Rules
        $rules = [
            'username' => 'required|max_length[50]',
            'password' => 'required|max_length[255]',
            'role' => 'required|in_list[admin,staff]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }
        // Mendapatkan data dari request
        $json = $this->request->getJSON();
        $data = [
            'username' => $json->username,
            'password' => password_hash($this->request->getPost('password'), PASSWORD_DEFAULT),
            'role' => $json->role
        ];
        // Simpan data ke database via UserModel
        if ($this->userModel->insert($data)) {
            return $this->respondCreated([
                'message' => 'User created successfully',
            ]);
        } else {
            return $this->fail('Failed to create user');
        }
    }
    public function login()
    {
        // Membaca input JSON
        $json = $this->request->getJSON();

        // Validasi JSON jika input kosong
        if (!$json || !isset($json->username) || !isset($json->password)) {
            return $this->fail('Invalid JSON payload');
        }

        $username = $json->username;
        $password = $json->password;

        $user = $this->userModel->where('username', $username)->first();

        if ($user) {
            if (password_verify($password, $user['password'])) {
                // Dapatkan waktu issuedAt dan exp dari JwtConfig
                $issuedAt = JwtConfig::getIssuedAt();
                $expirationTime = JwtConfig::getExpirationTime();
                $refreshExpirationTime = JwtConfig::getRefreshExpirationTime();

                // Buat access token
                $payload = [
                    'iat' => $issuedAt,
                    'exp' => $expirationTime,
                    'data' => [
                        'username' => $username,
                        'role' => $user['role']
                    ]
                ];
                $accessToken = JWT::encode($payload, JwtConfig::getSecretKey(), 'HS256');

                // Buat refresh token
                $refreshPayload = [
                    'iat' => $issuedAt,
                    'exp' => $refreshExpirationTime,
                    'data' => [
                        'username' => $username
                    ]
                ];
                $refreshToken = JWT::encode($refreshPayload, JwtConfig::getSecretKey(), 'HS256');

                // Simpan refresh token ke database
                $this->refreshTokenModel->insert([
                    'user_id' => $user['user_id'],
                    'refresh_token' => $refreshToken,
                    'expires_at' => date('Y-m-d H:i:s', $refreshExpirationTime)
                ]);

                // Simpan refresh token di HttpOnly cookie
                setcookie('refresh_token', $refreshToken, [
                    'expires' => $refreshExpirationTime,
                    'httponly' => true,
                    'secure' => false, // Gunakan secure hanya jika menggunakan HTTPS
                    'samesite' => 'Strict'
                ]);

                return $this->respond([
                    'access_token' => $accessToken,
                ]);
            } else {
                return $this->fail('Invalid password');
            }
        } else {
            return $this->fail('User not found');
        }
    }

    public function refreshToken()
    {
        // Ambil refresh token dari cookie
        $refreshToken = $_COOKIE['refresh_token'] ?? null;

        if (!$refreshToken) {
            return $this->failUnauthorized('Refresh token not found');
        }

        // Verifikasi refresh token
        try {
            $decoded = JWT::decode($refreshToken, new Key(JwtConfig::getSecretKey(), 'HS256'));
            $username = $decoded->data->username;

            // Dapatkan pengguna dari database
            $user = $this->userModel->where('username', $username)->first();
            $storedToken = $this->refreshTokenModel->where('user_id', $user['user_id'])->where('refresh_token', $refreshToken)->first();

            if ($user && $storedToken) {
                // Periksa token kadaluarsa
                if (strtotime($storedToken['expires_at']) < time()) {
                    $this->refreshTokenModel->delete($storedToken['id']);
                    return $this->failUnauthorized('Refresh token expired');
                }

                // Buat access token baru
                $issuedAt = JwtConfig::getIssuedAt();
                $expirationTime = JwtConfig::getExpirationTime();
                $payload = [
                    'iat' => $issuedAt,
                    'exp' => $expirationTime,
                    'data' => [
                        'username' => $username,
                        'role' => $user['role']
                    ]
                ];
                $accessToken = JWT::encode($payload, JwtConfig::getSecretKey(), 'HS256');

                return $this->respond([
                    'access_token' => $accessToken
                ]);
            } else {
                return $this->failUnauthorized('Invalid refresh token');
            }
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid refresh token');
        }
    }

    public function logout()
    {
        // Ambil refresh token dari cookie
        $refreshToken = $_COOKIE['refresh_token'] ?? null;

        if ($refreshToken) {
            // Hapus refresh token dari database
            $this->refreshTokenModel->where('refresh_token', $refreshToken)->delete();

            // Hapus cookie
            setcookie('refresh_token', '', [
                'expires' => time() - 3600,
                'httponly' => true,
                'secure' => false, // Gunakan secure hanya jika menggunakan HTTPS
                'samesite' => 'Strict'
            ]);
        }

        return $this->respond([
            'message' => 'Logout success'
        ]);
    }
}
