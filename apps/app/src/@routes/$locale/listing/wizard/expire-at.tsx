import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
	Status,
	Tx,
	Typo,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { ListingExpire } from "@zbav-se.me/sdk";
import { ExpireIcon, ThemeCls } from "@zbav-se.me/ui";
import { DateTime } from "luxon";
import { useId } from "react";
import { match } from "ts-pattern";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

export const Route = createFileRoute("/$locale/listing/wizard/expire-at")({
	validateSearch: ListingWizardSchema,
	component() {
		const navigate = Route.useNavigate();
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const expireId = useId();

		return (
			<ListingContainer
				textTitle={"Expire (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/location"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/listing/wizard/submit"}
						params={{
							locale,
						}}
						search={{
							...state,
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							size={"lg"}
							full
							iconPosition={"right"}
							label={"Next - submit (button)"}
						/>
					</LinkTo>
				}
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
									"gap-2",
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
										state.expiresAt === expire
											? "dark"
											: "light",
								}}
							>
								<Button
									ui="ExpireAtItem-root"
									onClick={() => {
										navigate({
											search({ expiresAt, ...prev }) {
												return {
													...prev,
													expiresAt: expire,
												};
											},
										});
									}}
									size={"xl"}
									full
									tweak={{
										slot: {
											root: {
												class: [
													"flex",
													"flex-row",
													"items-center",
													"justify-between",
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
											.with("7-days", () =>
												DateTime.now()
													.plus({
														days: 7,
													})
													.toFormat("dd.MM.yyyy"),
											)
											.with("14-days", () =>
												DateTime.now()
													.plus({
														days: 14,
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
								</Button>
							</VariantProvider>
						);
					})}
				</Status>
			</ListingContainer>
		);
	},
});
