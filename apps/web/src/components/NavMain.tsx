"use client";

import type { LucideIcon } from "lucide-react";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useStore } from "@/store/store";
import { Lock } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

const items: {
    title: "Passwords" | "Notes";
    icon: LucideIcon;
}[] = [
    {
        title: "Passwords",
        icon: Lock,
    },
    // {
    //     title: "Notes",
    //     icon: Notebook,
    // },
];

export function NavMain() {
    const { currentMainNav, setCurrentMainNav } = useStore(
        useShallow((state) => ({
            currentMainNav: state.currentMainNav,
            setCurrentMainNav: state.setCurrentMainNav,
        }))
    );
    const handleClick = (title: "Passwords" | "Notes") => {
        setCurrentMainNav(title);
    };

    return (
        <SidebarGroup>
            {/* <SidebarGroupLabel>Passman</SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            tooltip={item.title}
                            className={
                                currentMainNav === item.title ? "bg-accent" : ""
                            }
                            onClick={() => handleClick(item.title)}
                        >
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
