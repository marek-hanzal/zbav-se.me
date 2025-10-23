import { Badge, Status, Tx, Typo, type useSnapperNav } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { ListingExpire } from "@zbav-se.me/sdk";
import { DateTime } from "luxon";
import { type FC, memo, useId } from "react";
import { match } from "ts-pattern";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { ExpireIcon } from "~/app/ui/icon/ExpireIcon";
import { ThemeCls } from "~/app/ui/ThemeCls";

export namespace ExpireWrapper {
	export interface Props {
		listingNavApi: useSnapperNav.Api;
	}
}

export const ExpireWrapper: FC<ExpireWrapper.Props> = memo(
	({ listingNavApi }) => {
		const useCreateListingStore = useCreateListingContext();
		const expiresAt = useCreateListingStore((store) => store.expiresAt);
		const setExpiresAt = useCreateListingStore(
			(store) => store.setExpiresAt,
		);
		const hasExpiresAt = useCreateListingStore(
			(store) => store.hasExpiresAt,
		);
		const expireId = useId();

		return (
			<ListingContainer
				listingNavApi={listingNavApi}
				textTitle={"Expire (title)"}
				bottom={{
					next: hasExpiresAt,
				}}
			>
				<Status
					icon={ExpireIcon}
					textTitle={"Listing expire (title)"}
					textMessage={"Listing expire (message)"}
					tweak={{
						slot: {
							body: {
								class: [
									"flex",
									"flex-col",
									"gap-4",
								],
							},
						},
					}}
				>
					{Object.values(ListingExpire).map((expire) => {
						return (
							<VariantProvider
								key={`${expireId}-${expire}`}
								cls={ThemeCls}
								variant={{
									tone: "primary",
									theme:
										expiresAt === expire ? "dark" : "light",
								}}
							>
								<Badge
									onClick={() => setExpiresAt(expire)}
									size={"xl"}
									tweak={{
										slot: {
											root: {
												class: [
													"w-full",
													"flex",
													"flex-col",
													"items-center",
													"gap-1",
												],
											},
										},
									}}
								>
									<Tx
										label={`Expire in ${expire}`}
										font={"bold"}
									/>
									<Typo
										label={match(expire)
											.with("3-days", () =>
												DateTime.now()
													.plus({
														days: 3,
													})
													.toFormat("dd.MM.yyyy"),
											)
											.with("7-days", () =>
												DateTime.now()
													.plus({
														days: 7,
													})
													.toFormat("dd.MM.yyyy"),
											)
											.with("1-month", () =>
												DateTime.now()
													.plus({
														months: 1,
													})
													.toFormat("dd.MM.yyyy"),
											)
											.exhaustive()}
										size={"md"}
									/>
								</Badge>
							</VariantProvider>
						);
					})}
				</Status>
			</ListingContainer>
		);
	},
);
