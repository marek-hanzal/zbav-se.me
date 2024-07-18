import { getServerAuthSession } from "~/server/auth";
import { cn } from "~/toolbox/cn";
import { HydrateClient } from "~/trpc/server";
import { Logo } from "~/ui/Logo";
import { PostCard } from "~/ui/PostCard";
import { PostList } from "~/ui/PostList";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <main
        className={cn([
          "min-h-screen",
          "flex flex-col items-center",
          "bg-gradient-to-b",
          "from-orange-600 to-orange-400",
          "text-white",
        ])}
      >
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-12">
          <Logo />
          <section
            className={cn([
              "w-11/12",
              "bg-orange-50",
              "text-orange-900",
              "rounded-xl",
              "p-12",
              "shadow-lg",
            ])}
          >
            <PostList/>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
