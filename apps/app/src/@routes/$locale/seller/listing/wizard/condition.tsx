import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import { ConditionContainer } from "~/app/condition/ui/ConditionContainer";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

export const Route = createFileRoute("/$locale/seller/listing/wizard/condition")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();

		const selection = useSelection<Rating.RatingItem>({
			mode: "single",
			initial: state.condition
				? [
						{
							id: String(state.condition),
						},
					]
				: [],
		});

		const itemId = selection.optional.singleId();
		const condition = itemId ? Number.parseInt(itemId, 10) : undefined;

		return (
			<TitleContainer
				data-ui={"Condition"}
				textTitle={"Condition (title)"}
				left={
					<LinkTo
						to={"/$locale/seller/listing/wizard/category"}
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
						to={"/$locale/seller/listing/wizard/age"}
						params={{
							locale,
						}}
						search={{
							...state,
							condition,
						}}
						disabled={!selection.hasAny}
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							size={"lg"}
							full
							iconPosition={"right"}
							label={"Next - age (button)"}
							disabled={!selection.hasAny}
						/>
					</LinkTo>
				}
			>
				<ConditionContainer selection={selection} />
			</TitleContainer>
		);
	},
});
