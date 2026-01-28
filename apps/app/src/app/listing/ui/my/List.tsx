import { VisibilityProvider } from "@use-pico/client/context";
import { useElementVisibility, useLocale } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListingQuery } from "@zbav-se.me/sdk/api/buyer-session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import { type FC, useRef } from "react";
import { Content } from "./Content";

export namespace List {
	export interface Props extends Container.Props {
		query: tListingQuery;
	}
}

export const List: FC<List.Props> = ({ query, ...props }) => {
	const locale = useLocale();
	const scrollerRef = useRef<HTMLDivElement>(null);

	const visibility = useElementVisibility({
		scrollerRef,
		visible: {},
		proximity: {
			overscan: 4,
		},
	});

	return (
		<Container
			data-ui={"MyListing[Container]"}
			ref={scrollerRef}
			ui={{
				layout: "vertical-full",
				snap: "vertical",
				snapAlign: "center",
				height: "full",
			}}
			{...props}
		>
			<withListingCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					if (data.data.length === 0) {
						return (
							<Container
								ui={{
									layout: "vertical-centered",
									height: "full",
								}}
							>
								<Status
									data-ui={"MyListing-[Status-empty]"}
									icon={SearchIcon}
									textTitle={"No my listings (title)"}
									textMessage={"No my listings (message)"}
									action={
										<LinkTo
											icon={ArrowRightIcon}
											iconPosition={"right"}
											to={"/$locale/ui/seller/draft/resolve"}
											params={{
												locale,
											}}
											ui={{
												background: "default",
												border: true,
												shadow: true,
												round: "default",
												size: "default",
											}}
										>
											<Tx label={"Create listing (label)"} />
										</LinkTo>
									}
									ui={{
										tone: "brand",
										theme: "light",
										color: "lead",
										inner: "4xl",
									}}
									className="text-center"
								/>
							</Container>
						);
					}

					return (
						<VisibilityProvider store={visibility}>
							<Content
								_suspense={"I know"}
								query={query}
							/>
						</VisibilityProvider>
					);
				}}
			</withListingCollectionQuery.Suspense>
		</Container>
	);
};
