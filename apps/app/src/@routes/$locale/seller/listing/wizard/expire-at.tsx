import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
} from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import { tListingExpire } from "@zbav-se.me/sdk/api/session";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { TitleContainer } from "@zbav-se.me/ui/container";
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
		const navigate = Route.useNavigate();
		const [expiresAt, setExpiresAt] = useState<tListingExpire | undefined>(
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
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/seller",
									params: {
										locale,
									},
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/description-tags"}
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
							label={"Next - vendor & model (button)"}
							disabled={!expiresAt}
						/>
					</LinkTo>
				}
			>
				<Container
					layout={"vertical-flex"}
					gap={"sm"}
					width={"fit"}
					height={"auto"}
				>
					{Object.values(tListingExpire).map((expire) => {
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
				</Container>
			</TitleContainer>
		);
	},
});
