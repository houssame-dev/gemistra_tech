import Image from "next/image";
import { useTranslations } from "next-intl";

type LogoProps = {
  className?: string;
  imageClassName?: string;
  textClassName?: string;
};

export default function Logo({
  className = "",
  imageClassName = "h-8 w-auto lg:h-10",
  textClassName = "",
}: LogoProps) {
  const t = useTranslations("common");

  return (
    <span dir="ltr" className={`inline-flex items-center gap-3 whitespace-nowrap ${className}`}>
      <Image
        src="/logos/gemistra-logo.png"
        alt=""
        width={56}
        height={48}
        className={imageClassName}
        priority
      />
      <span className={`font-display text-xl font-bold tracking-tight text-ink lg:text-2xl ${textClassName}`}>
        {t("brandName")}
      </span>
    </span>
  );
}
