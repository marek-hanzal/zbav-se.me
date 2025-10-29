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

export const Route = createFileRoute("/$locale/seller/listing/wizard/age")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const [age, setAge] = useState<number | undefined>(state.age);

		return (
			<ListingContainer
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
						disabled={!age}
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
							disabled={!age}
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
							`Condition - Age [${value}] (hint)`
						}
						value={age ?? 0}
						onChange={setAge}
					/>
				</div>
			</ListingContainer>
		);
	},
});
