"use client";

import { useEffect, useState } from "react";

export default function ErrorTrigger() {
  const [shouldThrow, setShouldThrow] = useState(false);

  useEffect(() => {
    setShouldThrow(true);
  }, []);

  if (shouldThrow) throw new Error("Screenshot error boundary test");
  return null;
}
