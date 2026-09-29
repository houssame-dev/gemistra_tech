import { notFound } from "next/navigation";
import ErrorTrigger from "./ErrorTrigger";

export default function ErrorScreenshotRoute() {
  if (process.env.ENABLE_ERROR_TEST !== "1") notFound();
  return <ErrorTrigger />;
}
