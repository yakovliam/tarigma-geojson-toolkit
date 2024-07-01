import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AboutPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>
          Tarigma Corporation GeoJSON toolkit is a set of tools for working with
          GeoJSON files.
          <br /> &copy; {new Date().getFullYear()} Tarigma Corporation All
          rights reserved.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
