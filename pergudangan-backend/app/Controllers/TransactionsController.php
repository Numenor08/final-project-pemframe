<?php

namespace App\Controllers;

use App\Models\TransactionModel;
use App\Models\StockModel;
use CodeIgniter\RESTful\ResourceController;

class TransactionsController extends ResourceController
{
    protected $format = 'json';

    public function __construct()
    {
        $this->transactionModel = new TransactionModel();
        $this->stockModel = new StockModel();
    }

    // Menampilkan semua transaksi
    public function index()
    {
        $transactions = $this->transactionModel
            ->select('transactions.*, items.name as item_name')
            ->join('items', 'items.item_id = transactions.item_id')
            ->findAll();

        return $this->respond($transactions);
    }

    // Menambahkan transaksi baru (in/out)
    public function create()
    {
        $rules = [
            'item_id'          => 'required|is_not_unique[items.item_id]',
            'transaction_type' => 'required|in_list[in,out]',
            'quantity'         => 'required|integer|greater_than[0]',
            'note'             => 'permit_empty'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);

        // Update stok sesuai transaksi
        $stock = $this->stockModel->where('item_id', $data['item_id'])->first();

        if (!$stock) {
            return $this->fail('Stock record not found for the specified item.');
        }

        if ($data['transaction_type'] === 'in') {
            $newQuantity = $stock['quantity'] + $data['quantity'];
        } elseif ($data['transaction_type'] === 'out') {
            if ($stock['quantity'] < $data['quantity']) {
                return $this->fail('Insufficient stock for this transaction.');
            }
            $newQuantity = $stock['quantity'] - $data['quantity'];
        }

        // Update stok
        $this->stockModel->update($stock['stock_id'], ['quantity' => $newQuantity, 'updated_at' => date('Y-m-d H:i:s')]);

        // Tambahkan transaksi
        $transactionData = [
            'item_id'          => $data['item_id'],
            'transaction_type' => $data['transaction_type'],
            'quantity'         => $data['quantity'],
            'transaction_date' => date('Y-m-d H:i:s'),
            'note'             => $data['note']
        ];

        $this->transactionModel->insert($transactionData);

        return $this->respondCreated(['message' => 'Transaction recorded successfully']);
    }

    public function show($id = null)
    {
        $transaction = $this->transactionModel
            ->select('transactions.*, items.name as item_name')
            ->join('items', 'items.item_id = transactions.item_id')
            ->where('transactions.transaction_id', $id)
            ->first();

        if (!$transaction) {
            return $this->failNotFound('Transaction not found for ID ' . $id);
        }

        return $this->respond($transaction);
    }
}
