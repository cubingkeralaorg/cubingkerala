import {
  LearnBlock,
  LearnSection,
  ResourceList,
  VideoGrid,
} from "./video-card";

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

export default function BeginnerVideosSection() {
  return (
    <LearnSection title="Beginner Level">
      <LearnBlock label="Complete tutorials">
        <VideoGrid videos={beginnerVideos} />
      </LearnBlock>
      <LearnBlock label="What's next: Beginner CFOP">
        <VideoGrid videos={beginnerExtraVideos} />
      </LearnBlock>
      <LearnBlock label="Learning resources">
        <ResourceList resources={pdfs} />
      </LearnBlock>
    </LearnSection>
  );
}
