<?php

namespace App\Controllers;

use App\Config\JwtConfig;
use App\Models\UserModel;
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
            'password' => password_hash($json->password, PASSWORD_DEFAULT),
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

                // Buat access token
                $payload = [
                    'iat' => $issuedAt,
                    'exp' => $expirationTime,
                    'data' => [
                        'username' => $username,
                    ]
                ];
                $jwt = JWT::encode($payload, JwtConfig::getSecretKey(), 'HS256');

                return $this->respond([
                    'message' => 'Login successful',
                    'token' => $jwt
                ]);
            } else {
                return $this->fail('Invalid password');
            }
        } else {
            return $this->fail('User not found');
        }
    }
}