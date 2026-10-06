import Image from "next/image";
import type { Product } from "@/lib/types";
import { ScentArt } from "./scent-art";

/**
 * The product photo in a lit Pearl case. Brand photos come on pure white, so
 * the image multiplies onto Pearl: the white drops away and the bottle sits
 * in the case. Without a photo, the drawn placeholder stands in.
 */
export function ScentPhoto({
  product,
  sizes,
  priority = false,
  className = "",
  inset = "p-[8%]",
  fill = false,
}: {
  product: Pick<Product, "image" | "house" | "name" | "hue">;
  /** next/image sizes hint, e.g. "(min-width: 768px) 30vw, 80px". */
  sizes: string;
  priority?: boolean;
  className?: string;
  inset?: string;
  /** Fill the nearest positioned parent instead of sizing itself. */
  fill?: boolean;
}) {
  const label = `${product.house} ${product.name}`;
  if (!product.image) return <ScentArt hue={product.hue} label={label} className={`rounded-md ${className}`} />;
  return (
    <div className={`${fill ? "absolute inset-0" : "relative"} overflow-hidden rounded-md bg-ink ${className}`}>
      <div className={`absolute inset-0 ${inset}`}>
        <div className="relative h-full w-full">
          <Image
            src={product.image}
            alt={`${label}, 100ml bottle`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain mix-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
}
