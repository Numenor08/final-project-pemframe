import { useState } from "react";
import axios from "axios";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import { mutate } from 'swr';

const EditItem = ({ item, categories, suppliers, onClose }) => {
    const [itemName, setItemName] = useState(item.name);
    const [category, setCategory] = useState(item.category_id);
    const [supplier, setSupplier] = useState(item.suppliers_id);
    const [price, setPrice] = useState(item.unit_price);
    const [quantity, setQuantity] = useState(item.quantity);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!itemName || !category || !supplier || !price || !quantity) {
            setErrorMessage("Semua field harus diisi.");
            return;
        }

        try {
            const updatedItem = {
                name: itemName,
                category_id: category,
                suppliers_id: supplier,
                unit_price: price,
                quantity: quantity,
            };

            const response = await axios.put(`http://localhost:8080/api/items/${item.item_id}`, updatedItem);

            if (response.status === 200) {
                console.log("Item berhasil diperbarui:", response.data);
                onClose(); // Menutup modal setelah berhasil
                mutate('http://localhost:8080/api/items');
            } else {
                setErrorMessage("Gagal memperbarui item, coba lagi.");
            }
        } catch (error) {
            console.error("Error updating item:", error);
            setErrorMessage("Terjadi kesalahan saat memperbarui item.");
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
                <label className="block text-lg font-medium">Suplier</label>
                <select
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    required
                    className="w-full border-2 rounded px-1 py-1"
                >
                    <option value="">Pilih Suplier</option>
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
                <label className="block text-lg font-medium">Stock</label>
                <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
            </div>
            <Button type="submit" className="w-full">
                Update Barang
            </Button>
        </form>
    );
};

export default EditItem;