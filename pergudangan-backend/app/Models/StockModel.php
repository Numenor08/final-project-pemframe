<?php
namespace App\Models;

use CodeIgniter\Model;

class StockModel extends Model
{
    protected $table = 'stocks';
    protected $primaryKey = 'stock_id';
    protected $allowedFields = ['item_id', 'quantity', 'updated_at'];
}
