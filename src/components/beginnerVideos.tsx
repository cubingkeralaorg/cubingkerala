import { YouTubeEmbed } from "@next/third-parties/google";
import { Card } from "@/components/ui/card";
import BlurIn from "./ui/blur-in";
import { Badge } from "./ui/badge";

export default function BeginnerVideosSection() {
  const beginnerVideos = [
    { id: "PW2J8IblczM", title: "Simple beginner's guide" },
    { id: "7Ron6MN45LY", title: "10-minute beginner tutorial" },
    { id: "1t1OL2zN0LQ", title: "In-depth beginner's guide" },
  ];
  const beginnerExtraVideos = [
    { id: "M-vKaV2NbEo", title: "Cross" },
    { id: "ReOZZHscIGk", title: "F2L (First Two Layers)" },
    { id: "6PSBaxlBqRg", title: "2 Look OLL (Orientation of the Last Layer)" },
    { id: "ZC9nwou59ow", title: "2 Look PLL (Permutation of the Last Layer)" },
    {
      id: "4ULKZ1dZs04",
      title: "Tips to Solve the Rubik's Cube in 30 Seconds",
    },
  ];

  const pdfs = [
    {
      name: "CubeSkills Beginner Guide",
      url: "/pdf/cubeskills_beginners_guide.pdf",
    },
    { name: "CubeSkills F2L Guide", url: "/pdf/f2l.pdf" },
    { name: "CubeSkills Last Layer Guide", url: "/pdf/4-look-last-layer.pdf" },
  ];

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 md:px-5 space-y-2 md:space-y-4">
      <BlurIn
        word="Beginner Level"
        className="text-4xl text-start text-stone-200 font-bold tracking-tighter md:text-6xl"
      />
      <div className="space-y-5">
        <div className="w-fit">
          <h1 className="text-stone-400">
            Beginner level - Complete tutorials
          </h1>
          <hr className="w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {beginnerVideos.map((video, index) => (
            <div
              key={index}
              className="hover:bg-neutral-900 transition-all ease-in duration-200 rounded-md border border-neutral-800 p-2"
            >
              <h1 className="text-neutral-500 text-sm md:text-medium pb-2">
                {video.title}
              </h1>
              <VideoCard
                key={video.id}
                videoId={video.id}
                title={video.title}
              />
            </div>
          ))}
        </div>
        <div className="w-fit">
          <h1 className="text-stone-400">What&apos;s Next: Beginner CFOP</h1>
          <hr className="w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {beginnerExtraVideos.map((video, index) => (
            <div
              key={index}
              className="hover:bg-neutral-900 transition-all ease-in duration-200 rounded-md border border-neutral-800 p-2"
            >
              <h1 className="text-neutral-500 text-sm md:text-medium pb-2">
                {video.title}
              </h1>
              <VideoCard
                key={video.id}
                videoId={video.id}
                title={video.title}
              />
            </div>
          ))}
        </div>
        <div className="w-fit">
          <h1 className="text-stone-400">Learning Resources</h1>
          <hr className="w-full" />
        </div>
        <div className="px-4">
          <ul className="text-stone-400 space-y-1">
            {pdfs.map((pdf, index) => (
              <li key={index}>
                <a
                  className="hover:text-stone-200 transition-all ease-in-out duration-200"
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pdf.name}{" "}
                  <Badge className="text-[10px] px-1 py-0 bg-neutral-800 hover:bg-neutral-800 rounded-full text-stone-400">
                    PDF
                  </Badge>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ videoId, title }: { videoId: string; title: string }) {
  return (
    <Card className="overflow-hidden border-black">
      <div className="aspect-video w-full">
        <YouTubeEmbed
          videoid={videoId}
          params="rel=0"
          playlabel={`Play ${title}`}
        />
      </div>
    </Card>
  );
}
