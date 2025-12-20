import { useLocale } from "@use-pico/client/hook";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import { useRef, type FC } from "react";
import { Content } from "./Content";

export namespace List {
	export interface Props extends Container.Props {
		query: tListingQuery;
	}
}

export const List: FC<List.Props> = ({ query, ...props }) => {
	const locale = useLocale();
	const scrollerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"MyListing[Container]"}
			ui={{
				layout: "vertical-flex",
				scroll: "vertical",
				gap: "default",
				inner: "default",
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
						<Content
							_suspense={"I know"}
							query={query}
							scrollerRef={scrollerRef}
						/>
					);
				}}
			</withListingCollectionQuery.Suspense>
		</Container>
	);
};
