import { YouTubeEmbed } from "@next/third-parties/google";
import { Card } from "@/components/ui/card";
import BlurIn from "../ui/blur-in";
import { Badge } from "../ui/badge";

export default function AdvancedVideosSection() {
  const advancedVideos = [
    { id: "P9POsBAaKd0", title: "X-Cross (Cross + First Pair)" },
    { id: "CFIQMKxJP4k", title: "COLL-U" },
    { id: "rVrNZWbnXTg", title: "COLL-T" },
    { id: "U0dP8MJw-Ig", title: "COLL-L" },
    { id: "GJ7nsaOvwbM", title: "COLL-H" },
    { id: "YTpCBRiAuow", title: "COLL-Pi" },
    { id: "h0cmrhwuUL4", title: "Easy ZBLL's" },
  ];

  const pdfs = [
    {
      name: "JPerm COLL Algorithms",
      url: "https://jperm.net/algs/coll",
      link: true,
    },
    { name: "CubeRoot ZBLL Algorithms", url: "/pdf/167-ZBLL.pdf" },
  ];

  return (
    <div className="container mx-auto py-4 md:py-8 px-4 md:px-5 space-y-2 md:space-y-4">
      <BlurIn
        word="Advanced Level"
        className="text-4xl text-start text-foreground font-bold tracking-tighter md:text-6xl"
      />
      <div className="space-y-5">
        <div className="w-fit">
          <h1 className="text-muted-foreground">
            Advanced level - Innovative techniques
          </h1>
          <hr className="w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {advancedVideos.map((video, index) => (
            <div
              key={index}
              className="hover:bg-accent transition-all ease-in duration-200 rounded-md border border-border p-2"
            >
              <h1 className="text-muted-foreground text-sm md:text-medium pb-2">
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
          <h1 className="text-muted-foreground">Learning Resources</h1>
          <hr className="w-full" />
        </div>
        <div className="px-4">
          <ul className="text-muted-foreground space-y-1">
            {pdfs.map((pdf, index) => (
              <li key={index}>
                <a
                  className="hover:text-foreground transition-all ease-in-out duration-200"
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {pdf.name}{" "}
                  <Badge className="text-[10px] px-1 py-0 bg-secondary hover:bg-accent rounded-full text-muted-foreground">
                    {pdf.link ? "LINK" : "PDF"}
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
    <Card className="overflow-hidden border-border">
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
