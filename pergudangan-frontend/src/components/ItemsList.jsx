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
    const interval = 2000;
    const { data: items, error } = useSWR('http://localhost:8080/api/items', fetcher, {
        refreshInterval: interval
    });

    const { data: stock } = useSWR('http://localhost:8080/api/stocks', fetcher, {
        refreshInterval: interval
    });

    const { data: suppliers } = useSWR('http://localhost:8080/api/suppliers', fetcher, {
        refreshInterval: interval
    });

    const { data: categories } = useSWR('http://localhost:8080/api/categories', fetcher, {
        refreshInterval: interval
    });


    if (!items) {
        return <div>Loading...</div>; // Tampilkan loading state
    }

    if (error) {
        return <div>Terjadi kesalahan saat mengambil data.</div>; // Tampilkan error jika ada
    }
    return (
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
                            <TableCell>{categories.filter(s => s.category_id === item.category_id)[0].name || '-'}</TableCell>
                            <TableCell>{suppliers.filter(s => s.suppliers_id === item.suppliers_id)[0].name || '-'}</TableCell>
                            <TableCell>{formatRupiah(item.unit_price)}</TableCell>
                            <TableCell>
                                {stock.filter(s => s.item_name === item.name).length > 0 ? stock.filter(s => s.item_name === item.name)[0].quantity : 'Kosong'}
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ItemsList;
