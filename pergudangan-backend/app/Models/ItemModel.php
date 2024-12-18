<?php
namespace App\Models;

use CodeIgniter\Model;

class ItemModel extends Model
{
    protected $table = 'items';
    protected $primaryKey = 'item_id';
    protected $allowedFields = ['name', 'quantity', 'category_id', 'supplier_id', 'unit_price', 'created_at'];
}
