"use client";

import React from "react"
import { ErrorState } from "@/components/shared/error-state"

export default function Error() {
  return (
    <ErrorState
      code="401"
      title="Unauthorized Access"
      description="You do not have permission to access this area."
    />
  )
}
  