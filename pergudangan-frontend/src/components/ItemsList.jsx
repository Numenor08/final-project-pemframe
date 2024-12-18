import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { ReloadIcon, ArrowUpIcon, ArrowDownIcon } from '@radix-ui/react-icons';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@shadcn/ui/table";
import axios from "axios";
import Modal from "@/components/Modal";
import { AddItem } from "@/components/AddItem";
import EditItem from "@/components/EditItem";
import { Button } from "@shadcn/ui/button";

const fetcher = url => {
    const token = localStorage.getItem('token');
    return axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(res => res.data);
};

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

const ItemsList = () => {
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [showEditItemModal, setShowEditItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const interval = 2000;
    const { data: items, error } = useSWR('http://localhost:8080/api/items', fetcher, {
        refreshInterval: interval
    });

    const { data: suppliers } = useSWR('http://localhost:8080/api/suppliers', fetcher, {
        refreshInterval: interval
    });

    const { data: categories } = useSWR('http://localhost:8080/api/categories', fetcher, {
        refreshInterval: interval
    });

    if (!items || !suppliers || !categories) {
        return <div>Loading...</div>; // Tampilkan loading state
    }

    if (error) {
        return <div>Terjadi kesalahan saat mengambil data.</div>; // Tampilkan error jika ada
    }

    const sortedItems = [...items].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />;
        }
        return <ArrowUpIcon className="text-gray-400" />;
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setShowEditItemModal(true);
    };

    const handleDeleteItem = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8080/api/items/${itemId}`);
            mutate('http://localhost:8080/api/items');
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div className="w-full flex flex-col justify-center items-center gap-4">
            <div className="text-2xl font-bold mb-4 text-center">
                Daftar Barang
            </div>
            <Button className="max-w-[40%] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowAddItemModal(true)}>Tambah Barang</Button>
            <div className="overflow-x-auto w-full">
                <Table>
                    <TableCaption>List Data Barang di Gudang</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead onClick={() => requestSort('name')} className={`cursor-pointer ${sortConfig.key === 'name' ? 'font-bold' : ''}`}>
                                Nama {getSortIcon('name')}
                            </TableHead>
                            <TableHead onClick={() => requestSort('category_id')} className={`cursor-pointer ${sortConfig.key === 'category_id' ? 'font-bold' : ''}`}>
                                Kategori {getSortIcon('category_id')}
                            </TableHead>
                            <TableHead onClick={() => requestSort('suppliers_id')} className={`cursor-pointer ${sortConfig.key === 'suppliers_id' ? 'font-bold' : ''}`}>
                                Suplier {getSortIcon('suppliers_id')}
                            </TableHead>
                            <TableHead onClick={() => requestSort('unit_price')} className={`cursor-pointer ${sortConfig.key === 'unit_price' ? 'font-bold' : ''}`}>
                                Harga {getSortIcon('unit_price')}
                            </TableHead>
                            <TableHead onClick={() => requestSort('quantity')} className={`cursor-pointer ${sortConfig.key === 'quantity' ? 'font-bold' : ''}`}>
                                Stock {getSortIcon('quantity')}
                            </TableHead>
                            <TableHead className="text-center">Aksi</TableHead>
                            <TableHead className="w-5 flex justify-center items-center">
                                <div className='hover:cursor-pointer' onClick={() => mutate('http://localhost:8080/api/items')}>
                                    <ReloadIcon className="" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedItems.map((item) => (
                            <TableRow key={item.item_id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{categories.find(s => s.category_id === item.category_id)?.name || '-'}</TableCell>
                                <TableCell>{suppliers.find(s => s.suppliers_id === item.suppliers_id)?.name || '-'}</TableCell>
                                <TableCell>{formatRupiah(item.unit_price)}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell className="flex justify-center items-center gap-2">
                                    <Button onClick={() => handleEditItem(item)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">
                                        Edit
                                    </Button>
                                    <Button onClick={() => handleDeleteItem(item.item_id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                                        Hapus
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Modal open={showAddItemModal} onClose={() => setShowAddItemModal(false)}>
                    <AddItem onClose={() => setShowAddItemModal(false)} />
                </Modal>
                <Modal open={showEditItemModal} onClose={() => setShowEditItemModal(false)}>
                    <EditItem item={selectedItem} categories={categories} suppliers={suppliers} onClose={() => setShowEditItemModal(false)} />
                </Modal>
            </div>
        </div>
    );
};

export default ItemsList;