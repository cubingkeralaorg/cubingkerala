import type { ReactNode } from "react";
import { YouTubeEmbed } from "@next/third-parties/google";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VideoCard({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  return (
    <Card className="shadow-none">
      <CardHeader className="space-y-0 p-4 pb-3">
        <CardTitle className="text-sm font-medium leading-snug">
          {title}
        </CardTitle>
      </CardHeader>
      <div className="px-4 pb-4">
        <div className="aspect-video w-full overflow-hidden rounded-md">
          <YouTubeEmbed
            videoid={videoId}
            params="rel=0"
            playlabel={`Play ${title}`}
          />
        </div>
      </div>
    </Card>
  );
}

export function VideoGrid({
  videos,
}: {
  videos: { id: string; title: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard key={video.id} videoId={video.id} title={video.title} />
      ))}
    </div>
  );
}

export function ResourceList({
  resources,
}: {
  resources: { name: string; url: string; link?: boolean }[];
}) {
  return (
    <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
      {resources.map((resource) => (
        <li key={resource.url}>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            {resource.name}
            <span className="ml-2 text-xs text-muted-foreground">
              {resource.link ? "Link" : "PDF"}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function LearnSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function LearnBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
