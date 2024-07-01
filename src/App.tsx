import { Tabs } from "@radix-ui/react-tabs";
import { SegmentMergerPage } from "./pages/SegmentMergerPage";
import { TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { AboutPage } from "./pages/AboutPage";
import { PropertyEditorPage } from "./pages/PropertyEditorPage";

type TabListData = {
  value: string;
  label: string;
  page: React.ReactNode;
};

const tabListData: TabListData[] = [
  {
    value: "segment-merger",
    label: "Segment Merger",
    page: <SegmentMergerPage />,
  },
  {
    value: "property-editor",
    label: "Property Editor",
    page: <PropertyEditorPage />,
  },
  {
    value: "about",
    label: "About",
    page: <AboutPage />,
  },
];

function App() {
  const defaultValue = tabListData[0].value;
  return (
    <div className="pt-16 h-screen flex items-start justify-center">
      <Tabs defaultValue={defaultValue} className="w-[400px]">
        <TabsList className={"grid w-full grid-cols-3"}>
          {tabListData.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabListData.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tab.page}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default App;
