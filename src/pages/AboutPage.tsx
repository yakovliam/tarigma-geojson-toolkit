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
          &copy; {new Date().getFullYear()} Tarigma Corp. All rights reserved.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
