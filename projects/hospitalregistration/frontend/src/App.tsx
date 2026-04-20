import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import DataViewerPage from "./pages/DataViewerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/data" element={<DataViewerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
