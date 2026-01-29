import styled from "styled-components";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import * as Dialog from "@radix-ui/react-dialog";
import { DialogOverlay, DialogContent, DialogClose } from "./ui/Modals";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function AuthScreen({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <DialogOverlay />
        <DialogContent>
          <DialogClose asChild>
            <button aria-label="Close">
              <Cross2Icon />
            </button>
          </DialogClose>

          {mode === "login" ? <Login /> : <Signup />}

          <ToggleMode>
            <a onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login"
                ? "Create an account"
                : "Already have an account?"}
            </a>
          </ToggleMode>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const ToggleMode = styled.div`
  margin-top: 16px;
  text-align: center;

  a {
    cursor: pointer;
    color: #3b82f6; /* blue9 from Radix colors */
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;
