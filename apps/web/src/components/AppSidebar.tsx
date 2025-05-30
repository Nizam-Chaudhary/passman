import { GalleryVerticalEnd } from "lucide-react";

import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { TeamSwitcher } from "./TeamSwitcher";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "./ui/sidebar";

// This is sample data.
const data = {
    app: {
        name: "Passman",
        logo: GalleryVerticalEnd,
        plan: "Super",
    },
    // {
    // 	name: 'Acme Corp.',
    // 	logo: AudioWaveform,
    // 	plan: 'Startup',
    // },
    // {
    // 	name: 'Evil Corp.',
    // 	logo: Command,
    // 	plan: 'Free',
    // },

    // projects: [
    //     {
    //         name: "Design Engineering",
    //         url: "#",
    //         icon: Frame,
    //     },
    //     {
    //         name: "Sales & Marketing",
    //         url: "#",
    //         icon: PieChart,
    //     },
    //     {
    //         name: "Travel",
    //         url: "#",
    //         icon: Map,
    //     },
    // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher app={data.app} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
