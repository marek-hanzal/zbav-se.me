import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { asButton } from "@use-pico/theme/button";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingIcon } from "@zbav-se.me/ui/icon";

export const Route = createFileRoute("/$locale/seller/listing/wizard/start")({
	component() {
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();

		return (
			<TitleContainer
				data-ui="Start-root"
				textTitle={"New listing (title)"}
				left={
					<LinkTo
						{...asButton({
							round: "full",
							square: "default",
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					/>
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
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							size={"xl"}
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
