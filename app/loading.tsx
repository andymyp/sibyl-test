import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="absolute inset-0 z-[100] flex !overflow-hidden bg-gradient-to-br from-background via-background to-background/50">
      <div className="flex flex-col flex-1 items-center justify-center !overflow-hidden">
        <Loader2 className="animate-spin !size-13 text-primary" />
      </div>
    </div>
  );
}
