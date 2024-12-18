import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import {
  Card, CardTitle, CardHeader, CardContent, CardDescription,
  CardFooter
} from "@shadcn/ui/card";
import Modal from "@/components/Modal";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryName("");
    setCategoryDescription("");
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setShowModal(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${categoryId}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      setErrorMessage("Nama kategori tidak boleh kosong.");
      return;
    }

    try {
      if (selectedCategory) {
        await axios.put(`http://localhost:8080/api/categories/${selectedCategory.category_id}`, {
          name: categoryName,
          description: categoryDescription,
        });
      } else {
        await axios.post("http://localhost:8080/api/categories", {
          name: categoryName,
          description: categoryDescription,
        });
      }
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      setErrorMessage("Terjadi kesalahan saat menyimpan kategori.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold mb-4">Kategori</h2>
      <Button onClick={handleAddCategory} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Tambah Kategori
      </Button>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category.category_id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
              <CardDescription>
                {category.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button onClick={() => handleEditCategory(category)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                Edit
              </Button>
              <Button onClick={() => handleDeleteCategory(category.category_id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
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
              <label className="block text-lg font-medium">Nama Kategori</label>
              <Input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium">Deskripsi</label>
              <Input
                type="text"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {selectedCategory ? "Update Kategori" : "Tambah Kategori"}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Categories;