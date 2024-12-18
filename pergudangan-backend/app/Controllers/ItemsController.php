<?php
namespace App\Controllers;

use App\Models\ItemModel;
use CodeIgniter\RESTful\ResourceController;

class ItemsController extends ResourceController
{
    protected $modelName = 'App\Models\ItemModel';
    protected $format    = 'json';

    public function index()
    {
        return $this->respond($this->model->findAll());
    }

    public function create()
    {
        $data = $this->request->getJSON();
        $this->model->insert($data);
        return $this->respondCreated(['message' => 'Item added successfully']);
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        return $data ? $this->respond($data) : $this->failNotFound('Item not found');
    }

    public function update($id = null)
    {
        $data = $this->request->getJSON();
        $this->model->update($id, $data);
        return $this->respond(['message' => 'Item updated successfully']);
    }

    public function delete($id = null)
    {
        $this->model->delete($id);
        return $this->respondDeleted(['message' => 'Item deleted successfully']);
    }
}
