import React from "react"

export default function Error() {
    return (
      <div className="flex items-center justify-center min-h-[100vh] w-full bg-background -mt-24">
        <div className="max-w-xl px-4 text-center animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1">
            401
          </p>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Unauthorized Access
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground leading-relaxed">
            You do not have permission to access this area.
          </p>
        </div>
      </div>
    )
  }
  