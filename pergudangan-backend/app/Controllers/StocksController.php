<?php

namespace App\Controllers;

use App\Models\StockModel;
use App\Models\ItemModel;
use CodeIgniter\RESTful\ResourceController;

class StocksController extends ResourceController
{
    protected $format = 'json';
    protected $stockModel;
    protected $itemModel;

    public function __construct()
    {
        $this->stockModel = new StockModel();
        $this->itemModel = new ItemModel();
    }

    // Menampilkan semua stok
    public function index()
    {
        $stocks = $this->stockModel
            ->select('stocks.stock_id, items.name as item_name, stocks.quantity, stocks.updated_at')
            ->join('items', 'items.item_id = stocks.item_id')
            ->findAll();

        return $this->respond($stocks);
    }
    // Mengedit stok
    public function update($id = null)
    {
        $rules = [
            'quantity' => 'required|integer|greater_than[0]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON();

        // Cek apakah stok ada
        $stock = $this->stockModel->find($id);

        if (!$stock) {
            return $this->failNotFound('Stock not found for ID ' . $id);
        }

        // Update stok
        $updateData = [
            'quantity'   => $data->quantity,
            'updated_at' => date('Y-m-d H:i:s')
        ];

        $this->stockModel->update($id, $updateData);

        return $this->respond(['message' => 'Stock updated successfully']);
    }
    // Menambahkan stok baru
    public function create()
    {
        $rules = [
            'item_id'   => 'required|is_not_unique[items.item_id]',
            'quantity'  => 'required|integer|greater_than[0]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON();

        // Cek apakah stok sudah ada untuk item ini
        $existingStock = $this->stockModel->where('item_id', $data->item_id)->first();

        if ($existingStock) {
            // Update stok yang ada
            $newQuantity = $existingStock['quantity'] + $data->quantity;
            $this->stockModel->update($existingStock['stock_id'], ['quantity' => $newQuantity, 'updated_at' => date('Y-m-d H:i:s')]);

            return $this->respond(['message' => 'Stock updated successfully', 'new_quantity' => $newQuantity]);
        } else {
            // Insert stok baru
            $stockData = [
                'item_id'    => $data->item_id,
                'quantity'   => $data->quantity,
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $this->stockModel->insert($stockData);

            return $this->respondCreated(['message' => 'Stock added successfully']);
        }
    }
    public function show($id = null)
    {
        $stock = $this->stockModel
            ->select('stocks.stock_id, items.name as item_name, stocks.quantity, stocks.updated_at')
            ->join('items', 'items.item_id = stocks.item_id')
            ->where('stocks.stock_id', $id)
            ->first();

        if (!$stock) {
            return $this->failNotFound('Stock not found for ID ' . $id);
        }

        return $this->respond($stock);
    }
}
