<?php
namespace App\Config;

class JwtConfig
{
    private static $secretKey;

    public static function getSecretKey()
    {
        if (!self::$secretKey) {
            self::$secretKey = getenv('JWT_SECRET') ?: 'default_secret_key';
        }
        return self::$secretKey;
    }

    public static function getIssuedAt()
    {
        return time();
    }

    public static function getExpirationTime()
    {
        return time() + 60 * 120; // 2 jam dari waktu sekarang
    }

    public static function getRefreshExpirationTime()
    {
        return time() + 60 * 60 * 24 * 7; // 7 hari dari waktu sekarang
    }

    public static function getIssuer()
    {
        return 'localhost';
    }
}