import {
	Button,
	Container,
	Status,
	Tx,
	type useSnapperNav,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { type FC, memo } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { CategoryGroupIcon } from "~/app/ui/icon/CategoryGroupIcon";
import { CategoryIcon } from "~/app/ui/icon/CategoryIcon";
import { ConditionIcon } from "~/app/ui/icon/ConditionIcon";
import { LocationIcon } from "~/app/ui/icon/LocationIcon";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PostIcon } from "~/app/ui/icon/PostIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { ThemeCls } from "~/app/ui/ThemeCls";
import { TypoIcon } from "~/app/ui/text/TypoIcon";

export namespace IntroWrapper {
	export interface Props {
		listingNavApi: useSnapperNav.Api;
	}
}

export const IntroWrapper: FC<IntroWrapper.Props> = memo(
	({ listingNavApi }) => {
		return (
			<Container
				layout={"vertical-content-footer"}
				tone={"secondary"}
				theme={"light"}
				square={"md"}
				border={"default"}
				shadow={"default"}
			>
				<Sheet>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "light",
						}}
					>
						<Status
							icon={PostIcon}
							textTitle={"Listing - intro (title)"}
							textMessage={"Listing - intro (description)"}
							action={
								<Button
									iconEnabled={PhotoIcon}
									iconProps={{
										size: "md",
									}}
									label={"Add photo (cta)"}
									tone={"secondary"}
									theme={"dark"}
									size={"xl"}
									onClick={listingNavApi.next}
								/>
							}
							tweak={{
								slot: {
									body: {
										class: [
											"flex",
											"flex-col",
											"gap-2",
										],
									},
								},
							}}
						>
							<TypoIcon icon={PhotoIcon}>
								<Tx label={"Add photos (hint)"} />
							</TypoIcon>

							<TypoIcon icon={CategoryGroupIcon}>
								<Tx label={"Select category group (hint)"} />
							</TypoIcon>

							<TypoIcon icon={CategoryIcon}>
								<Tx label={"Select category (hint)"} />
							</TypoIcon>

							<TypoIcon icon={ConditionIcon}>
								<Tx label={"Set condition (hint)"} />
							</TypoIcon>

							<TypoIcon icon={PriceIcon}>
								<Tx label={"Set price (hint)"} />
							</TypoIcon>

							<TypoIcon icon={LocationIcon}>
								<Tx label={"Set location (hint)"} />
							</TypoIcon>
						</Status>
					</VariantProvider>
				</Sheet>
			</Container>
		);
	},
);
