import {
  LayoutGrid,
  LucideIcon,
  MessageCircleQuestion,
  Workflow,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Tools",
      menus: [
        {
          href: "/srp-gj-pipeline",
          label: "SRP GeoJSON Pipeline",
          active: pathname.includes("/srp-gj-pipeline"),
          icon: Workflow,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Misc",
      menus: [
        {
          href: "/about",
          label: "About",
          active: pathname.includes("/about"),
          icon: MessageCircleQuestion,
          submenus: [],
        },
      ],
    },
  ];
}
