import Link from "next/link";
import { AnimatedContactLink } from "@/components/contact";

const CubingKeralaCubingLengends = () => {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden text-foreground">
      <div className="container mx-auto px-4 md:px-8 border bg-neutral-500/[0.04] border-border rounded-lg py-10 md:py-24">
        <div className="space-y-4 sm:px-10 text-start lg:text-center flex flex-col items-start lg:items-center">
          <div className="inline-block rounded-lg text-sm text-green-500">
            Top Ranked Cubers
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Cubing Legends of Kerala
          </h2>
          <p className="max-w-[900px] text-muted-foreground text-[15px] md:text-lg">
            Meet the top-ranked Rubik&apos;s Cube solvers in Kerala.
          </p>
          <Link href="/rankings" className="w-fit">
            <AnimatedContactLink userInfo={null} text="Rankings" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CubingKeralaCubingLengends;
