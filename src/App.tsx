import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NewDesign from "./pages/NewDesign";
import DesignEditor from "./pages/DesignEditor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/design/new" element={<NewDesign />} />
      <Route path="/design/:id" element={<DesignEditor />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
