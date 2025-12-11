import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import { uiBackButton } from "@zbav-se.me/ui/ui";
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
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/category"}
						search={state}
						params={{
							locale,
						}}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						ui={{
							tone: "secondary",
						}}
						confirmProps={{
							ui: {
								tone: "danger",
							},
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
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - age (button)"}
							disabled={!selection.hasAny}
							ui={{
								tone: "secondary",
								theme: "dark",
								size: "lg",
							}}
						/>
					</LinkTo>
				}
			>
				<ConditionContainer selection={selection} />
			</TitleContainer>
		);
	},
});
