import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const ContentCls = ThemeCls.extend(
  {
    tokens: [],
    slot: ["root", "viewport", "content", "fadeTop", "fadeBottom"],
    variant: {},
  },
  ({ what, def }) => ({
    token: def.token({}),
    rules: [
      def.root({
        // wrapper pro overlaye (vlastní stacking kontext pro jistotu)
        root: what.css([
          "relative", "isolate",
          "min-h-0", "h-full", "overflow-hidden",
          // MUSÍ odpovídat pozadí scroll plochy
          "[--fade-color:rgb(224_231_255)]", // např. Tailwind bg-indigo-100
          "[--fade-solid:12px]",             // plný pás na začátku fadu (schová šev)
        ]),

        // jediný scrollport + stejné bg jako --fade-color
        viewport: what.css([
          "h-full", "overflow-auto", "overscroll-contain", "z-0",
          "bg-[rgb(224_231_255)]",
        ]),

        // obsah – top vert., center horiz.
        content: what.css([
          "min-h-full",
          "grid", "content-start", "justify-center",
          "px-0",
        ]),

        // horní fade (gradient → plynule do transparent)
        fadeTop: what.css([
          "pointer-events-none",
          "absolute", "inset-x-0", "-top-px", "z-10",
          "opacity-0",
          "will-change-[opacity]",
          "bg-[linear-gradient(to_bottom,var(--fade-color),var(--fade-color)_var(--fade-solid),transparent)]",
        ]),

        // spodní fade
        fadeBottom: what.css([
          "pointer-events-none",
          "absolute", "inset-x-0", "-bottom-px", "z-10",
          "opacity-0",
          "will-change-[opacity]",
          "bg-[linear-gradient(to_top,var(--fade-color),var(--fade-color)_var(--fade-solid),transparent)]",
        ]),
      }),
    ],
    defaults: def.defaults({}),
  }),
);

export type ContentCls = typeof ContentCls;
export namespace ContentCls {
  export type Props<P = unknown> = Cls.Props<ContentCls, P>;
}
