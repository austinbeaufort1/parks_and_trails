import * as Accordion from "@radix-ui/react-accordion";
import { CaretDownIcon } from "@radix-ui/react-icons";

interface AccordionIndicatorProps {
  state?: "open" | "closed";
}

export const AccordionIndicator: React.FC<AccordionIndicatorProps> = ({
  state,
}) => {
  const open = state === "open";

  return (
    <CaretDownIcon
      style={{
        marginLeft: 8,
        transition: "transform 0.2s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    />
  );
};
