import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { AgeContainer } from "~/app/age/ui/AgeContainer";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

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
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/condition"}
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
									to: "/$locale/ui/seller",
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
					>
						<Button
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - price (button)"}
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
				<AgeContainer selection={selection} />
			</TitleContainer>
		);
	},
});
