import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Spinner } from "@use-pico/client/ui/spinner";
import { withCategoryCartCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { CategoryCartListContainer } from "~/app/category/ui/CategoryCartListContainer";

export const Route = createFileRoute("/$locale/buyer/cart/list")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Your cart (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<Spinner />
			</TitleContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();

		const categoryCartCollectionQuery = withCategoryCartCollectionQuery.useSuspenseQuery({
			filter: {
				locale,
			},
			sort: [
				{
					field: "listingCount",
					direction: "desc",
				},
			],
			cursor: {
				page: 0,
				size: 256,
			},
		});

		return (
			<TitleContainer
				textTitle={"Your cart (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<Container scroll={"vertical"}>
					<CategoryCartListContainer
						_suspense={"I know"}
						locale={locale}
						categoryCartList={categoryCartCollectionQuery.data.data}
						linkTo={({ categoryCart, children }) => (
							<LinkTo
								key={categoryCart.id}
								to={"/$locale/buyer/cart/category/$id/feed"}
								params={{
									locale,
									id: categoryCart.id,
								}}
								display={"block"}
								tone={"primary"}
								full
							>
								{children}
							</LinkTo>
						)}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
