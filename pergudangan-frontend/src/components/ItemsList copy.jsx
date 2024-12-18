import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { ReloadIcon } from '@radix-ui/react-icons';
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
                            <TableHead>Nama</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Suplier</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="w-5 flex justify-center items-center">
                                <div className='hover:cursor-pointer' onClick={() => mutate('http://localhost:8080/api/items')}>
                                    <ReloadIcon className="" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.item_id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{categories.find(s => s.category_id === item.category_id)?.name || '-'}</TableCell>
                                <TableCell>{suppliers.find(s => s.suppliers_id === item.suppliers_id)?.name || '-'}</TableCell>
                                <TableCell>{formatRupiah(item.unit_price)}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Modal open={showAddItemModal} onClose={() => setShowAddItemModal(false)}>
                    <AddItem onClose={() => setShowAddItemModal(false)} />
                </Modal>
            </div>
        </div>
    );
};

export default ItemsList;