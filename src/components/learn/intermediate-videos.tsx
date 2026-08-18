import {
  LearnBlock,
  LearnSection,
  ResourceList,
  VideoGrid,
} from "./video-card";

const intermediateVideos = [
  { id: "__q-5MwlOiU", title: "How to turn faster" },
  { id: "KWe4SNIMtrg", title: "Advanced finger tricks" },
  { id: "HDlDcRhCR0Q", title: "Cross tips" },
];

const intermediateExtraVideos = [
  { id: "BtDLfh0XZkE", title: "All F2L Cases" },
  { id: "Q947zZRYMdg", title: "Full OLL Algorithms" },
  { id: "QVXKNAjl_0k", title: "Full PLL Algorithms" },
];

const pdfs = [
  {
    name: "CubeSkills All Angle F2L Guide",
    url: "/pdf/f2l-algorithms-different-slot-positions.pdf",
  },
  { name: "CubeSkills OLL Guide", url: "/pdf/oll-algorithms.pdf" },
  { name: "CubeSkills PLL Guide", url: "/pdf/pll-algorithms.pdf" },
];

export default function IntermediateVideosSection() {
  return (
    <LearnSection title="Intermediate Level">
      <LearnBlock label="Tips and tricks">
        <VideoGrid videos={intermediateVideos} />
      </LearnBlock>
      <LearnBlock label="What's next: Learn more algorithms">
        <VideoGrid videos={intermediateExtraVideos} />
      </LearnBlock>
      <LearnBlock label="Learning resources">
        <ResourceList resources={pdfs} />
      </LearnBlock>
    </LearnSection>
  );
}
