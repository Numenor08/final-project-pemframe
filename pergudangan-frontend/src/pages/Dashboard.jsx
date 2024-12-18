import { useState } from "react";
import { Button } from "@shadcn/ui/button";
import ItemsList from "../components/ItemsList";
import Modal from "../components/Modal";
import { AddItem } from "../components/AddItem";

function Dashboard() {
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <navbar className="flex justify-between items-center mb-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold">Sistem Pergudangan</h1>
      </navbar>
      
      <main className="w-full max-w-[70vw] min-w-[50vw] flex flex-col justify-center items-center gap-">
        <div className="text-2xl font-bold mb-4 text-center">
          Daftar Barang
        </div>
        <Button className="max-w-[40%]" onClick={() => setShowAddItemModal(true)}>Tambah Barang</Button>
        <ItemsList />
      </main>

      <Modal open={showAddItemModal} onClose={() => setShowAddItemModal(false)}>
        <AddItem onClose={() => setShowAddItemModal(false)} />
      </Modal>
    </div>
  );
}

export default Dashboard;