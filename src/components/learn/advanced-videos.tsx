import {
  LearnBlock,
  LearnSection,
  ResourceList,
  VideoGrid,
} from "./video-card";

const advancedVideos = [
  { id: "P9POsBAaKd0", title: "X-Cross (Cross + First Pair)" },
  { id: "CFIQMKxJP4k", title: "COLL-U" },
  { id: "rVrNZWbnXTg", title: "COLL-T" },
  { id: "U0dP8MJw-Ig", title: "COLL-L" },
  { id: "GJ7nsaOvwbM", title: "COLL-H" },
  { id: "YTpCBRiAuow", title: "COLL-Pi" },
  { id: "h0cmrhwuUL4", title: "Easy ZBLL's" },
];

const resources = [
  {
    name: "JPerm COLL Algorithms",
    url: "https://jperm.net/algs/coll",
    link: true,
  },
  { name: "CubeRoot ZBLL Algorithms", url: "/pdf/167-ZBLL.pdf" },
];

export default function AdvancedVideosSection() {
  return (
    <LearnSection title="Advanced Level">
      <LearnBlock label="Innovative techniques">
        <VideoGrid videos={advancedVideos} />
      </LearnBlock>
      <LearnBlock label="Learning resources">
        <ResourceList resources={resources} />
      </LearnBlock>
    </LearnSection>
  );
}
