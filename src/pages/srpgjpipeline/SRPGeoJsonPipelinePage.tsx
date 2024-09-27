import { ContentLayout } from "@/components/panel/content-layout";
import { SRPGeoJsonPipelineTool } from "@/components/tools/SRPGeoJsonPipelineTool";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

export default function SRPGeoJsonPipelinePage() {
  return (
    <ContentLayout title="SRP GeoJSON Pipeline">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>SRP GeoJSON Pipeline</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <SRPGeoJsonPipelineTool />
    </ContentLayout>
  );
}
