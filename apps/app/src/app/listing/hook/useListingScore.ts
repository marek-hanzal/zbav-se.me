import { useQueryClient } from "@tanstack/react-query";
import { useVisible } from "@use-pico/client/hook";
import type { tListingScoreTypeEnum } from "@zbav-se.me/sdk/api/user";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { useCallback, useEffect, useRef } from "react";

export namespace useListingScore {
	export interface Props {
		/**
		 * This switch _is not reactive_. It's useful when you _know_ you're not interested in scoring
		 */
		enabled: boolean;
		listingId: string;
		type: tListingScoreTypeEnum;
		timeoutMs: number;
	}
}

export const useListingScore = ({ enabled, listingId, type, timeoutMs }: useListingScore.Props) => {
	const queryClient = useQueryClient();
	const useStore = useVisible();
	const visible = useStore((state) => state.getById(listingId)?.visible ?? false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const listingScoreCreateMutation = withListingScoreCreateMutation.useMutation({
		onSuccess() {
			withListingMetricsFetchQuery.invalidate(queryClient, listingId);
		},
		retry() {
			return visible;
		},
		retryDelay(count) {
			if (count >= 3) {
				return 0;
			}
			return 1000 * 60 * 5;
		},
	});

	const score = useCallback(
		(listingId: string, type: tListingScoreTypeEnum) => {
			listingScoreCreateMutation.mutate({
				listingId,
				score: type,
			});
		},
		[
			listingScoreCreateMutation,
		],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We're watching only visible flag
	useEffect(() => {
		if (!enabled) {
			return;
		}

		clearTimeout(timerRef.current);

		if (visible) {
			timerRef.current = setTimeout(() => {
				score(listingId, type);
			}, timeoutMs);
		}

		return () => {
			clearTimeout(timerRef.current);
		};
	}, [
		enabled,
		visible,
	]);
};
