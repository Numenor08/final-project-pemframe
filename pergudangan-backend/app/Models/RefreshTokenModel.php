<?php
namespace App\Models;

use CodeIgniter\Model;

class RefreshTokenModel extends Model
{
    protected $table = 'refresh_tokens';
    protected $primaryKey = 'id';
    protected $allowedFields = ['user_id', 'refresh_token', 'expires_at', 'created_at'];
}