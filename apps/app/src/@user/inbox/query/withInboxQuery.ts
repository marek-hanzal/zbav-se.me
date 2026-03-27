import { withEntityQuery } from "@use-pico/client/query";
import { inboxCollectionFn } from "~/@user/inbox/server/fn/inboxCollectionFn";
import { inboxCountFn } from "~/@user/inbox/server/fn/inboxCountFn";
import { inboxFetchFn } from "~/@user/inbox/server/fn/inboxFetchFn";
import { inboxPatchCollectionFn } from "~/@user/inbox/server/fn/inboxPatchCollectionFn";
import { inboxPatchFn } from "~/@user/inbox/server/fn/inboxPatchFn";
import type { InboxCountQuerySchema } from "~/@user/inbox/server/schema/InboxCountQuerySchema";
import type { InboxPatchCollectionSchema } from "~/@user/inbox/server/schema/InboxPatchCollectionSchema";
import type { InboxPatchSchema } from "~/@user/inbox/server/schema/InboxPatchSchema";
import type { InboxQuerySchema } from "~/@user/inbox/server/schema/InboxQuerySchema";
import type { InboxSchema } from "~/@user/inbox/server/schema/InboxSchema";

export const withInboxQuery = withEntityQuery<
	InboxSchema.Type,
	InboxQuerySchema.Type,
	InboxQuerySchema.Type,
	InboxCountQuerySchema.Type,
	InboxPatchSchema.Type,
	never,
	never,
	InboxPatchCollectionSchema.Type
>({
	keys: () => [
		"inbox",
	],
	toIdKey: (id) => ({
		where: {
			id,
		},
	}),
	async fetchFn(data) {
		return inboxFetchFn({
			data,
		});
	},
	async collectionFn(data) {
		return inboxCollectionFn({
			data,
		});
	},
	async countFn(data) {
		return inboxCountFn({
			data,
		});
	},
	async createFn(_data) {
		throw new Error("Inbox create is not supported.");
	},
	async deleteFn(_data) {
		throw new Error("Inbox delete is not supported.");
	},
	async patchFn(data) {
		return inboxPatchFn({
			data,
		});
	},
	async patchCollectionFn(data) {
		return inboxPatchCollectionFn({
			data,
		});
	},
});
