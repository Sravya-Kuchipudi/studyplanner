
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  heading?: string;
  subheading?: string;
}

const PageContainer = ({
  children,
  className,
  heading,
  subheading,
}: PageContainerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn("space-y-6", className)}>
      {(heading || subheading) && (
        <div>
          {heading && <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>}
          {subheading && <p className="text-muted-foreground">{subheading}</p>}
        </div>
      )}
      <div className={cn("w-full", isMobile ? "px-0" : "")}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
