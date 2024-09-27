import { ContentLayout } from "@/components/panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <ContentLayout title="About">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>About</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>
            Tarigma Corporation GeoJSON toolkit is a set of tools for working
            with GeoJSON files.
            <br /> &copy; {new Date().getFullYear()} Tarigma Corporation All
            rights reserved.
          </CardDescription>
        </CardHeader>
      </Card>
    </ContentLayout>
  );
}
