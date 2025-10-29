import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
	Tx,
	Typo,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { ListingExpire } from "@zbav-se.me/sdk";
import { ThemeCls, TitleContainer } from "@zbav-se.me/ui";
import { DateTime } from "luxon";
import { useId, useState } from "react";
import { match } from "ts-pattern";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

export const Route = createFileRoute(
	"/$locale/seller/listing/wizard/expire-at",
)({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const [expiresAt, setExpiresAt] = useState<ListingExpire | undefined>(
			state.expiresAt,
		);
		const expireId = useId();

		return (
			<TitleContainer
				textTitle={"Expire (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/location"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/submit"}
						params={{
							locale,
						}}
						search={{
							...state,
							expiresAt,
						}}
						disabled={!expiresAt}
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
							disabled={!expiresAt}
						/>
					</LinkTo>
				}
			>
				<div
					className={"grid grid-rows-1 justify-stretch items-center"}
				>
					<div className={"flex flex-col gap-2 items-center"}>
						{Object.values(ListingExpire).map((expire) => {
							return (
								<VariantProvider
									key={`${expireId}-${expire}`}
									cls={ThemeCls}
									variant={{
										tone: "primary",
										theme:
											expiresAt === expire
												? "dark"
												: "light",
									}}
								>
									<Button
										ui="ExpireAtItem-root"
										onClick={() => {
											setExpiresAt(expire);
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
					</div>
				</div>
			</TitleContainer>
		);
	},
});
