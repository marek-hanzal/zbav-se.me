import type { SnapperNav } from "@use-pico/client";
import { useMemo } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { DotIcon } from "~/app/ui/icon/DotIcon";

export const useSnapperPage = (): SnapperNav.Page[] => {
	const useCreateListingStore = useCreateListingContext();
	const photoCountLimit = useCreateListingStore(
		(store) => store.photoCountLimit,
	);
	const photos = useCreateListingStore((store) => store.photos);

	return useMemo(
		() =>
			Array.from(
				{
					length: photoCountLimit,
				},
				(_, index) =>
					({
						id: `p-${index + 1}`,
						icon: DotIcon,
						iconProps() {
							return photos[index]
								? {
										tone: "secondary",
									}
								: {
										tone: "primary",
									};
						},
					}) satisfies SnapperNav.Page,
			),
		[
			photoCountLimit,
			photos,
		],
	);
};
