import { Container, Icon, Status, type useSnapperNav } from "@use-pico/client";
import { type FC, memo, useId } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import type { createListingStore } from "~/app/listing/store/createListingStore";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { ListingPageIndex } from "~/app/listing/ui/CreateListing/ListingPageIndex";
import { Sheet } from "~/app/sheet/Sheet";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export namespace InvalidSubmit {
	export interface Props {
		listingNavApi: useSnapperNav.Api;
	}
}

export const InvalidSubmit: FC<InvalidSubmit.Props> = memo(
	({ listingNavApi }) => {
		const useCreateListingStore = useCreateListingContext();
		const missing = useCreateListingStore((store) => store.missing);
		const missingId = useId();

		return (
			<ListingContainer listingNavApi={listingNavApi}>
				<Sheet
					tone={"primary"}
					theme={"light"}
				>
					<Status
						icon={SendPackageIcon}
						tone={"primary"}
						theme={"light"}
						textTitle="Submit listing - status - cannot submit (title)"
						textMessage={
							"Submit listing - status - cannot submit (message)"
						}
						action={
							<Container
								layout={"horizontal-full"}
								overflow={"horizontal"}
							>
								<div className="flex flex-row items-center justify-center gap-2 w-fit mx-auto">
									{Object.entries(ListingPageIndex.Page).map(
										([key, { index, icon }]) =>
											missing.includes(
												key as createListingStore.Missing,
											) ? (
												<Icon
													key={`${missingId}-${key}`}
													icon={icon}
													tone={"secondary"}
													size={"xl"}
													onClick={() =>
														listingNavApi.snapTo(
															index,
														)
													}
												/>
											) : null,
									)}
								</div>
							</Container>
						}
					/>
				</Sheet>
			</ListingContainer>
		);
	},
);
