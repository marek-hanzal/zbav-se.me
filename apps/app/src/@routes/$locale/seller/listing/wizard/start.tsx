import { createFileRoute } from "@tanstack/react-router";
import { Button, Container, LinkTo, Status, Tx } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import {
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

export const Route = createFileRoute("/$locale/seller/listing/wizard/start")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				ui="ListingWizard-Start-root"
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
								<LinkTo
									to="/$locale/seller/listing/wizard/photos"
									params={{
										locale,
									}}
								>
									<Button
										iconEnabled={PhotoIcon}
										iconProps={{
											size: "md",
										}}
										label={"Add photo (cta)"}
										tone={"secondary"}
										theme={"dark"}
										size={"xl"}
									/>
								</LinkTo>
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
});
