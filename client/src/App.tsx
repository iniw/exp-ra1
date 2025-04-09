import { BrowserRouter, Routes, Route } from "react-router";
import Read from "./pages/Read";
import Create from "./pages/Create";
import Update from "./pages/Update";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Read />} />
        <Route path="/create" element={<Create />} />
        <Route path="/update/:id" element={<Update />} />
      </Routes>
    </BrowserRouter>
  );
}
