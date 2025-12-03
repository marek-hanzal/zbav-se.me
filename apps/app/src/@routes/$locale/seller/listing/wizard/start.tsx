import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingIcon } from "@zbav-se.me/ui/icon";

export const Route = createFileRoute("/$locale/seller/listing/wizard/start")({
	component() {
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();

		return (
			<TitleContainer
				ui="Start-root"
				textTitle={"New listing (title)"}
				left={
					<LinkTo
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						iconProps={{
							size: "md",
						}}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/seller",
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/photos"}
						params={{
							locale,
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							size={"xl"}
							full
							iconPosition={"right"}
							label={"Listing - start (button)"}
						/>
					</LinkTo>
				}
			>
				<Status
					icon={ListingIcon}
					textTitle={"Listing - start (title)"}
					textMessage={"Listing - start (text)"}
					tone={"primary"}
					theme={"light"}
				/>
			</TitleContainer>
		);
	},
});
