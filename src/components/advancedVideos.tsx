import { YouTubeEmbed } from "@next/third-parties/google";
import { Card } from "@/components/ui/card";
import BlurIn from "./ui/blur-in";
import { Badge } from "./ui/badge";

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
//   const advancedExtraVideos = [
//     { id: "BtDLfh0XZkE", title: "All F2L Cases" },
//     { id: "Q947zZRYMdg", title: "Full OLL Algorithms" },
//     { id: "QVXKNAjl_0k", title: "Full PLL Algorithms" },
//   ];

  const pdfs = [
    { name: "JPerm COLL Algorithms", url: "https://jperm.net/algs/coll", link: true },
    { name: "CubeRoot ZBLL Algorithms", url: "/pdf/167-ZBLL.pdf" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <BlurIn
        word="Advanced Level"
        className="text-4xl text-center md:text-center text-stone-200 font-bold tracking-tighter md:text-6xl"
      />
      <div className="space-y-5">
        <div className="w-fit mx-auto md:mx-0">
          <h1 className="text-stone-400">
            Advanced level - Innovative techniques
          </h1>
          <hr className="w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {advancedVideos.map((video, index) => (
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
        {/* <div className="w-fit mx-auto md:mx-0">
          <h1 className="text-stone-400">What's Next: Learn more algorithms</h1>
          <hr className="w-full" />
        </div> */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {advancedExtraVideos.map((video, index) => (
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
        </div> */}
        <div className="w-fit mx-auto md:mx-0">
          <h1 className="text-stone-400">Learning Resources</h1>
          <hr className="w-full" />
        </div>
        <div className="px-4">
          <ul className="text-stone-400 space-y-1">
            {pdfs.map((pdf, index) => (
              <li key={index}>
                <a className="hover:text-stone-200 transition-all ease-in-out duration-200" href={pdf.url} target="_blank" rel="noopener noreferrer">
                  {pdf.name} <Badge className="text-[10px] px-1 py-0 bg-neutral-800 hover:bg-neutral-800 rounded-full text-stone-400">{pdf.link ? "LINK" : "PDF"}</Badge>
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
