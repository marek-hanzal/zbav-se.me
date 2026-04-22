import { toolFeedCollection } from "~/buyer/feed/server/tool/toolFeedCollection";
import { toolFeedCreate } from "~/buyer/feed/server/tool/toolFeedCreate";
import { toolFeedDelete } from "~/buyer/feed/server/tool/toolFeedDelete";
import { toolFeedPatch } from "~/buyer/feed/server/tool/toolFeedPatch";

export const FeedTool = [
	toolFeedCollection,
	toolFeedCreate,
	toolFeedDelete,
	toolFeedPatch,
] as const;
