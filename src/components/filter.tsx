import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"

export function FilterComponent() {
  return (
    <Menubar className="rounded-none">
      <MenubarMenu>
        <MenubarTrigger>Event</MenubarTrigger>
        <MenubarContent className="max-h-60 overflow-y-auto">
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <span>|</span>
      <MenubarMenu>
        <MenubarTrigger>Round</MenubarTrigger>
        <MenubarContent className="max-h-60 overflow-y-auto">
          <MenubarItem>Single</MenubarItem>
          <MenubarItem>Average</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
