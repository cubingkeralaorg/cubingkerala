import LoadingComponent from "@/components/shared/loading";

// app/competitions/loading.js
export default function LoginLoadingForPage() {
  return <div className="flex-1 flex min-h-screen">
    <LoadingComponent />
  </div>;
}