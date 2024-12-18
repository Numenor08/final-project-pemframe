import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import {
  Card, CardTitle, CardHeader, CardContent, CardDescription,
  CardFooter
} from "@shadcn/ui/card";
import Modal from "@/components/Modal";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const [supplierAddress, setSupplierAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/suppliers");
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleAddSupplier = () => {
    setSelectedSupplier(null);
    setSupplierName("");
    setSupplierAddress("");
    setShowModal(true);
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setSupplierName(supplier.name);
    setSupplierAddress(supplier.address);
    setShowModal(true);
  };

  const handleDeleteSupplier = async (supplierId) => {
    try {
      await axios.delete(`http://localhost:8080/api/suppliers/${supplierId}`);
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supplierName || !supplierAddress) {
      setErrorMessage("Nama dan alamat supplier tidak boleh kosong.");
      return;
    }

    try {
      if (selectedSupplier) {
        await axios.put(`http://localhost:8080/api/suppliers/${selectedSupplier.supplier_id}`, {
          name: supplierName,
          address: supplierAddress,
        });
      } else {
        await axios.post("http://localhost:8080/api/suppliers", {
          name: supplierName,
          address: supplierAddress,
        });
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving supplier:", error);
      setErrorMessage("Terjadi kesalahan saat menyimpan supplier.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold mb-4">Supplier</h2>
      <Button onClick={handleAddSupplier} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Tambah Supplier
      </Button>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.supplier_id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{supplier.name}</CardTitle>
              <CardDescription>
                {supplier.address}
              </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button onClick={() => handleEditSupplier(supplier)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Edit
              </Button>
              <Button onClick={() => handleDeleteSupplier(supplier.supplier_id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Hapus
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {showModal && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <div>
              <label className="block text-lg font-medium">Nama Supplier</label>
              <Input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium">Alamat</label>
              <Input
                type="text"
                value={supplierAddress}
                onChange={(e) => setSupplierAddress(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {selectedSupplier ? "Update Supplier" : "Tambah Supplier"}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Suppliers;