import type { MarkSuspense } from "@use-pico/client/type";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace WarmupCache {
	export interface Props extends MarkSuspense.Props {
		//
	}
}

export const WarmupCache: FC<WarmupCache.Props> = ({ _suspense }) => {
	/**
	 * Inbox warm-up
	 */
	{
		withInboxQuery.useCountQuery({
			where: {
				priority: "high",
				archivedAtIsNull: true,
			},
		});
	}

	/**
	 * Listing warm-up
	 */
	{
		//
	}

	return null;
};
