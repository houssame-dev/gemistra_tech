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
        src="/logos/gemistra-logo-color.png"
        alt=""
        width={58}
        height={48}
        className={imageClassName}
        priority
      />
      <span className={`font-display text-xl font-bold tracking-tight lg:text-2xl ${textClassName}`}>
        <span className="text-brand-navy">{t("brandFirst")}</span>{" "}
        <span className="text-brand-cyan">{t("brandSecond")}</span>
      </span>
    </span>
  );
}
