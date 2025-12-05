import { useVisibilityContext } from "@use-pico/client/context";
import { useDocumentVisibility } from "@use-pico/client/hook";
import type { tListingScoreTypeEnum } from "@zbav-se.me/sdk/api/user";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { useCallback, useEffect, useRef } from "react";

export namespace useListingScore {
	export interface Props {
		/**
		 * This switch _is not reactive_. It's useful when you _know_ you're not interested in scoring
		 */
		enabled: boolean;
		listingId: string;
		type: tListingScoreTypeEnum;
		timeout: number;
	}
}

export const useListingScore = ({ enabled, listingId, type, timeout }: useListingScore.Props) => {
	const useVisibilityStore = useVisibilityContext();
	const visible = useVisibilityStore((store) => store.visible);

	const documentRef = useRef<boolean>(document.visibilityState === "visible");
	const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const listingScoreCreateMutation = withListingScoreCreateMutation.useMutation({
		retry() {
			return visible && documentRef.current;
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
			if (!documentRef.current || !visible) {
				return;
			}

			listingScoreCreateMutation.mutate({
				listingId,
				score: type,
			});
		},
		[
			listingScoreCreateMutation,
			visible,
		],
	);

	useDocumentVisibility({
		onVisible() {
			if (!enabled) {
				return;
			}

			documentRef.current = true;

			timerRef.current = setTimeout(() => {
				score(listingId, type);
			}, timeout);
		},
		onHidden() {
			documentRef.current = false;

			clearTimeout(timerRef.current);
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: One-time shot
	useEffect(() => {
		if (!enabled) {
			return;
		}

		clearTimeout(timerRef.current);

		timerRef.current = setTimeout(() => {
			score(listingId, type);
		}, timeout);

		return () => {
			clearTimeout(timerRef.current);
		};
	}, []);
};
