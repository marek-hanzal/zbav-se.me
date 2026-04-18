import { useCallback, useEffect, useRef } from "react";
import { useVisible } from "@/lib/client/visibility";
import { withListingEventCreateMutation } from "~/buyer/listing-event/mutation/withListingEventCreateMutation";
import type { ListingEventEnumSchema } from "~/common/listing/enum/ListingEventEnumSchema";
import { useLogger } from "~/common/log/hook/useLogger";

export namespace useListingEvent {
	export interface Props {
		/**
		 * This switch _is not reactive_. It's useful when you _know_ you're not interested in event tracking
		 */
		enabled: boolean;
		listingId: string;
		event: ListingEventEnumSchema.Type;
		timeoutMs: number;
	}
}

export const useListingEvent = ({
	enabled,
	listingId,
	event,
	timeoutMs,
}: useListingEvent.Props) => {
	const logger = useLogger({
		name: [
			"hook",
			"useListingEvent",
		],
	});
	const useStore = useVisible();
	const visible = useStore((state) => state.getById(listingId)?.visible ?? false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const listingEventCreateMutation = withListingEventCreateMutation.useMutation({
		retry(_, error) {
			logger.trace("Retry", {
				visible,
				error,
			});
			return visible && error.type !== "error";
		},
		retryDelay(count) {
			logger.trace("Retrying", {
				count,
			});
			if (count >= 3) {
				return 0;
			}
			return 1000 * 60 * 5;
		},
	});

	const create = useCallback(
		(listingId: string, event: ListingEventEnumSchema.Type) => {
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
				logger.trace("Scheduling event", {
					listingId,
					event,
					timeoutMs,
				});
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
