import { useEffect, useState } from "react";

/** Decode only the requested scene; retain the current plate until its replacement is ready. */
export function CrossfadeImage({ src }: { src: string | undefined }) {
  const [plates, setPlates] = useState({ visible: src, previous: undefined as string | undefined });
  useEffect(() => {
    if (!src || src === plates.visible) return;
    let cancelled = false;
    const image = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Scene image unavailable"));
      image.src = src;
    });
    const ready = typeof image.decode === "function" ? image.decode() : loaded;
    // decode() handles its own error; consume the parallel load promise as well.
    void loaded.catch(() => {});
    void ready
      .then(() => {
        if (!cancelled) setPlates((old) => ({ visible: src, previous: old.visible }));
      })
      .catch(() => {
        /* Retain the last available decorative image if loading fails. */
      });
    return () => {
      cancelled = true;
      image.onload = null;
      image.onerror = null;
    };
  }, [src, plates.visible]);
  return (
    <div className="industry-visual">
      {plates.previous && (
        <img src={plates.previous} alt="" width={1920} height={1088} aria-hidden="true" />
      )}
      <img
        key={plates.visible}
        className={plates.previous ? "industry-image-enter" : ""}
        src={plates.visible}
        alt=""
        width={1920}
        height={1088}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
