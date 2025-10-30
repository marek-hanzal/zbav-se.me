import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
	useSelection,
} from "@use-pico/client";
import { TitleContainer } from "@zbav-se.me/ui";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { Rating } from "~/app/ui/rating/Rating";

export const Route = createFileRoute(
	"/$locale/seller/listing/wizard/condition",
)({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

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
				textTitle={"Condition (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/category"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
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
						full
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
				<div
					className={
						"grid grid-rows-1 justify-stretch items-center w-full h-full"
					}
				>
					<Rating
						textHint={(value) =>
							`Condition - Overall [${value}] (hint)`
						}
						selection={selection}
					/>
				</div>
			</TitleContainer>
		);
	},
});
