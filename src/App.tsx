import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PanelLayout from "./components/panel/panel-layout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import { AboutPage } from "./pages/about/AboutPage";
import SRPGeoJsonPipelinePage from "./pages/srpgjpipeline/SRPGeoJsonPipelinePage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <PanelLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/srp-gj-pipeline"
              element={<SRPGeoJsonPipelinePage />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<div>Not Found</div>} />{" "}
          </Routes>
        </PanelLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;
