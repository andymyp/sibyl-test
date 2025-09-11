import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="absolute inset-0 z-[100] flex !overflow-hidden bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col flex-1 items-center justify-center !overflow-hidden">
        <Loader2 className="animate-spin !size-13 text-primary" />
      </div>
    </div>
  );
}
