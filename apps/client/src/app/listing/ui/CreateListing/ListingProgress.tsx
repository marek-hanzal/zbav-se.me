import { useCls } from "@use-pico/cls";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const ListingProgress = () => {
	const useCreateListingStore = useCreateListingContext();
	const missing = useCreateListingStore((store) => store.missing);
	const requiredCount = useCreateListingStore((store) => store.requiredCount);
	const { slots } = useCls(ThemeCls);

	return (
		<div
			className={slots.default({
				slot: {
					default: {
						class: [
							"absolute",
							"top-2",
							"left-2",
							"right-2",
							"opacity-25",
							"z-[50]",
						],
						token: [
							"round.full",
						],
					},
				},
			})}
		>
			<div
				className={slots.default({
					slot: {
						default: {
							class: [
								"h-1",
								"transition-all",
							],
							token: [
								"round.full",
								"tone.primary.dark.bg",
							],
						},
					},
				})}
				style={{
					width: `${Math.min(100, 100 - (missing.length / requiredCount) * 100)}%`,
				}}
			/>
		</div>
	);
};
