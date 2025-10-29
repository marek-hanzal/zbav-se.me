import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
} from "@use-pico/client";
import { useState } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/ListingContainer";
import { Rating } from "~/app/ui/rating/Rating";

export const Route = createFileRoute(
	"/$locale/seller/listing/wizard/condition",
)({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const [condition, setCondition] = useState<number | undefined>(
			state.condition,
		);

		return (
			<ListingContainer
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
						disabled={!condition}
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							size={"lg"}
							full
							iconPosition={"right"}
							label={"Next - age (button)"}
							disabled={!condition}
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
						value={condition ?? 0}
						onChange={setCondition}
					/>
				</div>
			</ListingContainer>
		);
	},
});
