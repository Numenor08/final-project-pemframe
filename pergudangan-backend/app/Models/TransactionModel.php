<?php
namespace App\Models;

use CodeIgniter\Model;

class TransactionModel extends Model
{
    protected $table = 'transactions';
    protected $primaryKey = 'transaction_id';
    protected $allowedFields = ['item_id', 'transaction_type', 'quantity', 'transaction_date', 'note'];
}
