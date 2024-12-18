<?php
namespace App\Controllers;

use App\Models\SupplierModel;
use CodeIgniter\RESTful\ResourceController;

class SuppliersController extends ResourceController
{
    protected $format = 'json';

    public function __construct()
    {
        $this->supplierModel = new SupplierModel();
    }

    // Menampilkan semua supplier
    public function index()
    {
        $suppliers = $this->supplierModel->findAll();
        return $this->respond($suppliers);
    }

    // Menampilkan detail supplier berdasarkan ID
    public function show($id = null)
    {
        $supplier = $this->supplierModel->find($id);

        if (!$supplier) {
            return $this->failNotFound('Supplier not found');
        }

        return $this->respond($supplier);
    }

    // Menambahkan supplier baru
    public function create()
    {
        $rules = [
            'name'          => 'required|min_length[3]',
            'contact_info'  => 'required',
            'address'       => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $data['created_at'] = date('Y-m-d H:i:s');

        $this->supplierModel->insert($data);

        return $this->respondCreated(['message' => 'Supplier added successfully']);
    }

    // Memperbarui data supplier berdasarkan ID
    public function update($id = null)
    {
        $supplier = $this->supplierModel->find($id);

        if (!$supplier) {
            return $this->failNotFound('Supplier not found');
        }

        $rules = [
            'name'          => 'required|min_length[3]',
            'contact_info'  => 'required',
            'address'       => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = $this->request->getJSON(true);
        $data['created_at'] = $supplier['created_at'];

        $this->supplierModel->update($id, $data);

        return $this->respond(['message' => 'Supplier updated successfully']);
    }

    // Menghapus supplier berdasarkan ID
    public function delete($id = null)
    {
        $supplier = $this->supplierModel->find($id);

        if (!$supplier) {
            return $this->failNotFound('Supplier not found');
        }

        $this->supplierModel->delete($id);
        return $this->respondDeleted(['message' => 'Supplier deleted successfully']);
    }
}
