import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { BriefPage } from "./pages/BriefPage";
import { GeneratePage } from "./pages/GeneratePage";
import { PoolPage } from "./pages/PoolPage";
import { MaterialsPage } from "./pages/MaterialsPage";
import { ReviewPage } from "./pages/ReviewPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BriefPage />} />
          <Route path="generate" element={<GeneratePage />} />
          <Route path="pool" element={<PoolPage />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="review" element={<ReviewPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
