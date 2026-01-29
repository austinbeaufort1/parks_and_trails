import * as Dialog from "@radix-ui/react-dialog";
import styled from "styled-components";
import { slate } from "@radix-ui/colors";

export const DialogOverlay = styled(Dialog.Overlay)`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  inset: 0;
`;

export const DialogContent = styled(Dialog.Content)`
  background: ${slate.slate1};
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.1);
`;

export const DialogClose = styled(Dialog.Close)`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
`;
