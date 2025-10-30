import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
	useSelection,
} from "@use-pico/client";
import { TitleContainer } from "@zbav-se.me/ui";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { Rating } from "~/app/ui/rating/Rating";

export const Route = createFileRoute("/$locale/seller/listing/wizard/age")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();

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
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/condition"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
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
				<Container
					scroll={"vertical"}
					height={"fit"}
					width={"fit"}
				>
					<Rating
						textHint={(value) =>
							`Condition - Age [${value}] (hint)`
						}
						selection={selection}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
