// src/components/ui/LoadSpinnerWrapper.tsx
import { useEffect, useState } from "react";
import LoadSpinner from "./Loader";

interface LoadSpinnerWrapperProps {
  loading: boolean;
  size?: number;
}

export const LoadSpinnerWrapper: React.FC<LoadSpinnerWrapperProps> = ({
  loading,
  size = 48,
}) => {
  const [show, setShow] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShow(true);
    } else {
      // keep spinner mounted a little longer to avoid stutter
      const timeout = setTimeout(() => setShow(false), 50); // 50ms delay
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (!show) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 50,
        transition: "opacity 0.2s ease-out",
        opacity: loading ? 1 : 0,
      }}
    >
      <LoadSpinner size={size} />
    </div>
  );
};
