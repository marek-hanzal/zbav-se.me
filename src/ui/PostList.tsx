import { cn } from "~/toolbox/cn";
import { PostCard } from "~/ui/PostCard";

export namespace PostList {
  export interface Props {}
}

export const PostList: React.FC<PostList.Props> = ({}) => {
  return (
    <div className={cn(["flex flex-row flex-wrap"])}>
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
};
