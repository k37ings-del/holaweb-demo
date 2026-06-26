import { useScrollReveal } from "@/hooks/useScrollReveal";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollSection = ({ children, className = "" }: ScrollSectionProps) => {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollSection;
