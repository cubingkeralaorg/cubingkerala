"use client";

import React from "react";

interface ErrorStateProps {
  code?: string | number;
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const ErrorState = ({ code, title, description, children }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] w-full bg-background -mt-20 px-4">
      <div className="max-w-xl text-center animate-fade-in">
        {code && (
          <p className="text-sm text-muted-foreground mb-1">
            {code}
          </p>
        )}
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
          {title}
        </h2>
        <p className="text-sm md:text-lg text-muted-foreground/80 leading-relaxed mb-6">
          {description}
        </p>
        {children}
      </div>
    </div>
  );
};
