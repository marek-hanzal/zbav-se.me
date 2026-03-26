import { withEntityQuery } from "@use-pico/client/query";
import { inboxCollectionFn } from "~/server/@user/inbox/fn/inboxCollectionFn";
import { inboxCountFn } from "~/server/@user/inbox/fn/inboxCountFn";
import { inboxFetchFn } from "~/server/@user/inbox/fn/inboxFetchFn";
import { inboxPatchCollectionFn } from "~/server/@user/inbox/fn/inboxPatchCollectionFn";
import { inboxPatchFn } from "~/server/@user/inbox/fn/inboxPatchFn";
import type { InboxCountQuerySchema } from "~/server/@user/inbox/schema/InboxCountQuerySchema";
import type { InboxPatchCollectionSchema } from "~/server/@user/inbox/schema/InboxPatchCollectionSchema";
import type { InboxPatchSchema } from "~/server/@user/inbox/schema/InboxPatchSchema";
import type { InboxQuerySchema } from "~/server/@user/inbox/schema/InboxQuerySchema";
import type { InboxSchema } from "~/server/@user/inbox/schema/InboxSchema";

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
