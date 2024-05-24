"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Drawer as MyDrawer } from "vaul";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface DrawerProps {
  isOpen?: boolean;
  handleClose?: () => void;
  children: React.ReactNode;
}

export function Drawer({ isOpen = true, handleClose, children }: DrawerProps) {
  const [open, setOpen] = useState(isOpen);
  const router = useRouter();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  return (
    <MyDrawer.Root dismissible={true} onClose={() => router.back() } open={open}>
      <MyDrawer.Portal>
        <MyDrawer.Overlay className="fixed inset-0 bg-black/40" />
        <MyDrawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px]">
          <div className="flex-1 rounded-t-[10px] bg-white p-4 dark:bg-gray-800 dark:text-white flex justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="absolute right-3 top-2"
            >
              <X className=" text-black dark:text-white" />
            </Button>
            {children}
          </div>
        </MyDrawer.Content>
      </MyDrawer.Portal>
    </MyDrawer.Root>
  );
}
