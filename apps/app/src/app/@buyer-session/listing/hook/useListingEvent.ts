import { useVisible } from "@use-pico/client/hook";
import type { tListingEventEnum } from "@zbav-se.me/sdk/api/public";
import { withListingEventCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-session/listing-event";
import { useCallback, useEffect, useRef } from "react";

export namespace useListingEvent {
	export interface Props {
		/**
		 * This switch _is not reactive_. It's useful when you _know_ you're not interested in event tracking
		 */
		enabled: boolean;
		listingId: string;
		event: tListingEventEnum;
		timeoutMs: number;
	}
}

export const useListingEvent = ({
	enabled,
	listingId,
	event,
	timeoutMs,
}: useListingEvent.Props) => {
	const useStore = useVisible();
	const visible = useStore((state) => state.getById(listingId)?.visible ?? false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const listingEventCreateMutation = withListingEventCreateMutation.useMutation({
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

	const create = useCallback(
		(listingId: string, event: tListingEventEnum) => {
			listingEventCreateMutation.mutate({
				listingId,
				event,
			});
		},
		[
			listingEventCreateMutation,
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
				create(listingId, event);
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
