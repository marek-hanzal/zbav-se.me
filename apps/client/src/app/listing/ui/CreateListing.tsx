import { Container } from "@use-pico/client";
import type { FC } from "react";
import { CategoryWrapper } from "~/app/listing/ui/CreateListing/Category/CategoryWrapper";
import { CategoryGroupWrapper } from "~/app/listing/ui/CreateListing/CategoryGroup/CategoryGroupWrapper";
import { ConditionWrapper } from "~/app/listing/ui/CreateListing/Condition/ConditionWrapper";
import { LocationWrapper } from "~/app/listing/ui/CreateListing/Location/LocationWrapper";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "~/app/listing/ui/CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "~/app/listing/ui/CreateListing/Submit/SubmitWrapper";

export namespace CreateListing {
	export interface Props {
		locale: string;
	}
}

export const CreateListing: FC<CreateListing.Props> = ({ locale }) => {
	return (
		<Container
			layout="vertical"
			position={"relative"}
		>
			<Container
				layout={"vertical-full"}
				snap={"vertical-start"}
				gap={"md"}
			>
				<PhotosWrapper />

				<CategoryGroupWrapper locale={locale} />

				<CategoryWrapper locale={locale} />

				<ConditionWrapper />

				<PriceWrapper locale={locale} />

				<LocationWrapper locale={locale} />

				<SubmitWrapper />
			</Container>
		</Container>
	);
};
