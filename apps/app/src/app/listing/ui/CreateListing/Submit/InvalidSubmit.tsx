import { Container, Icon, Status } from "@use-pico/client";
import { SendPackageIcon, Sheet } from "@zbav-se.me/ui";
import { type FC, memo, useId } from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import type { createListingStore } from "~/app/listing/store/createListingStore";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { ListingPageIndex } from "~/app/listing/ui/CreateListing/ListingPageIndex";

export const InvalidSubmit: FC = memo(() => {
	const useCreateListingStore = useCreateListingContext();
	const missing = useCreateListingStore((store) => store.missing);
	const missingId = useId();

	return (
		<ListingContainer>
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
												onClick={() => {
													//
												}}
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
});
