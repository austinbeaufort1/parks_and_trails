import * as Accordion from "@radix-ui/react-accordion";
import { AccordionIndicator } from "./AccordionIndicator";
import styled from "styled-components";

const Trigger = styled(Accordion.Trigger)`
  all: unset;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
`;

export const TrailAccordion: React.FC<{
  items: { key: string; label: React.ReactNode; content: React.ReactNode }[];
}> = ({ items }) => {
  return (
    <Accordion.Root type="single" collapsible>
      {items.map(({ key, label, content }) => (
        <Accordion.Item value={key} key={key}>
          <Trigger>
            {label}
            {/* read state from data-state attribute */}
            <AccordionIndicator
              state={
                (
                  document.querySelector(`[value="${key}"]`) as HTMLElement
                )?.getAttribute("data-state") as "open" | "closed"
              }
            />
          </Trigger>
          <Accordion.Content>{content}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};
