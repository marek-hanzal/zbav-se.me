import { cn } from "~/toolbox/cn";

export namespace PostCard {
  export interface Props {}
}

export const PostCard: React.FC<PostCard.Props> = ({}) => {
  return (
    <div className={cn(["w-1/6"])}>
      <div
        className={cn([
          "m-4 rounded-xl bg-orange-100 p-12 text-orange-900 shadow-md hover:shadow-lg",
        ])}
      >
        foo -bar
      </div>
    </div>
  );
};
