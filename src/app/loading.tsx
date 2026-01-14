import { Loader } from "@/components/loader";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <Loader className="w-12 h-12 text-primary" />
      <h1 className="mt-4 text-2xl font-headline text-foreground">Stylecast</h1>
      <p className="text-muted-foreground">正在準備您的個人化體驗...</p>
    </div>
  );
}
