// src/components/AddItem.js
import { useState, useEffect } from "react";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import axios from "axios";

export const AddItem = ({ onClose }) => {
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");  // Menyimpan kategori
    const [supplier, setSupplier] = useState("");  // Menyimpan supplier
    const [price, setPrice] = useState("");  // Menyimpan harga
    const [stock, setStock] = useState("");  // Menyimpan stok
    const [categories, setCategories] = useState([]); // Untuk kategori
    const [suppliers, setSuppliers] = useState([]); // Untuk supplier
    const [errorMessage, setErrorMessage] = useState("");

    // Ambil data kategori dan supplier saat komponen pertama kali di-render
    useEffect(() => {
        // Ambil data kategori
        axios.get("http://localhost:8080/api/categories")
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });

        // Ambil data supplier
        axios.get("http://localhost:8080/api/suppliers")
            .then((response) => {
                setSuppliers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching suppliers:", error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validasi input
        if (!itemName || !category || !supplier || !price || !stock) {
            setErrorMessage("Semua field harus diisi.");
            return;
        }

        try {
            const newItem = {
                name: itemName,
                category_id: category,
                supplier_id: supplier,
                unit_price: parseFloat(price),
                quantity: parseInt(stock, 10),
            };

            console.log(newItem);
            // Lakukan request untuk menambahkan barang
            const response = await axios.post("http://localhost:8080/api/items", newItem);

            if (response.status === 201) {
                console.log("Item berhasil ditambahkan:", response.data);
                onClose(); // Menutup modal setelah berhasil
            } else {
                setErrorMessage("Gagal menambahkan item, coba lagi.");
            }
        } catch (error) {
            console.error("Error adding item:", error);
            setErrorMessage("Terjadi kesalahan saat menambahkan item.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <div>
                <label className="block text-lg font-medium">Nama Barang</label>
                <Input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-lg font-medium">Kategori</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full border-2 rounded px-1 py-1"
                >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-lg font-medium">Supplier</label>
                <select
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    required
                    className="w-full border-2 rounded px-1 py-1"
                >
                    <option value="">Pilih Supplier</option>
                    {suppliers.map((sup) => (
                        <option key={sup.supplier_id} value={sup.supplier_id}>
                            {sup.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-lg font-medium">Harga</label>
                <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-lg font-medium">Stok</label>
                <Input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full">
                Tambah Barang
            </Button>
        </form>
    );
};
