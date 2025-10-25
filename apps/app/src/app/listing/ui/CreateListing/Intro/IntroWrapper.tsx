import {
	Button,
	Container,
	Status,
	Tx,
	type useSnapperNav,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import {
	CategoryGroupIcon,
	CategoryIcon,
	ConditionIcon,
	LocationIcon,
	PhotoIcon,
	PostIcon,
	PriceIcon,
	Sheet,
	ThemeCls,
	TypoIcon,
} from "@zbav-se.me/ui";
import { type FC, memo } from "react";

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
											"items-start",
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
