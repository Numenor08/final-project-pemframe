import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Categories from "@/components/Categories";
import Suppliers from "@/components/Suppliers";
import Transactions from "@/components/Transactions";
import ItemsList from "@/components/ItemsList";
import LoginPass from "@/components/LoginPass"

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route element={<LoginPass />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route path="" element={<ItemsList />} />
            <Route path="supplier" element={<Suppliers />} />
            <Route path="kategori" element={<Categories />} />
            <Route path="transaction" element={<Transactions />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;