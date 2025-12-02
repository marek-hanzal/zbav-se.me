import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { AgeContainer } from "../../../../../../../../packages/@zbav-se.me/common/src/age/AgeContainer";

export const Route = createFileRoute("/$locale/seller/listing/wizard/age")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();

		const selection = useSelection<Rating.RatingItem>({
			mode: "single",
			initial: state.age
				? [
						{
							id: String(state.age),
						},
					]
				: [],
		});

		const itemId = selection.optional.singleId();
		const age = itemId ? Number.parseInt(itemId, 10) : undefined;

		return (
			<TitleContainer
				textTitle={"Age (title)"}
				left={
					<LinkTo
						to={"/$locale/seller/listing/wizard/condition"}
						search={state}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						iconProps={{
							size: "md",
						}}
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
						to={"/$locale/seller/listing/wizard/price"}
						params={{
							locale,
						}}
						search={{
							...state,
							age,
						}}
						disabled={!selection.hasAny}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							size={"lg"}
							full
							iconPosition={"right"}
							label={"Next - price (button)"}
							disabled={!selection.hasAny}
						/>
					</LinkTo>
				}
			>
				<AgeContainer selection={selection} />
			</TitleContainer>
		);
	},
});
