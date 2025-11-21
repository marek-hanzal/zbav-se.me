import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Typo } from "@use-pico/client/ui/typo";
import { CategoryInline } from "@zbav-se.me/common/category";
import type { tCategoryCart } from "@zbav-se.me/sdk/api/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import type { FC, PropsWithChildren, ReactNode } from "react";

export namespace CategoryCartListContainer {
	export namespace LinkTo {
		export interface Props extends PropsWithChildren {
			locale: string;
			categoryCart: tCategoryCart;
		}

		export type RenderFn = (props: Props) => ReactNode;
	}

	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		categoryCartList: tCategoryCart[];
		linkTo: LinkTo.RenderFn;
	}
}

export const CategoryCartListContainer: FC<CategoryCartListContainer.Props> = ({
	_suspense,
	locale,
	categoryCartList,
	linkTo,
	...props
}) => {
	const feedCountQuery = withFeedCountQuery.useSuspenseQuery({});

	return (
		<Container
			layout={"vertical-flex"}
			gap={"sm"}
			{...props}
		>
			{categoryCartList.map((categoryCart) =>
				linkTo({
					locale,
					categoryCart,
					children: (
						<Badge
							ui={"CategoryCartListContainer-badge"}
							round={"default"}
							tweak={{
								slot: {
									root: {
										class: [
											"inline-flex",
											"flex-row",
											"items-center",
											"justify-between",
											"h-fit",
											"w-full",
										],
										token: [
											"round.default",
											"square.md",
										],
									},
								},
							}}
						>
							<CategoryInline category={categoryCart} />

							<div className="inline-flex flex-row gap-2 items-center">
								<Typo
									label={`${categoryCart.listingCount}x`}
									font={"bold"}
								/>

								<Icon icon={ArrowRightIcon} />
							</div>
						</Badge>
					),
				}),
			)}

			{categoryCartList.length === 0 ? (
				<Container
					layout={"vertical-centered"}
					items={"center"}
				>
					{feedCountQuery.data.filter > 0 ? (
						<Status
							icon={FeedIcon}
							tone={"primary"}
							textTitle={"Your cart is empty - feed (title)"}
							textMessage={"Your cart is empty - feed (message)"}
							action={
								<LinkTo
									to={"/$locale/buyer/feed/select"}
									params={{
										locale,
									}}
								>
									<Button
										iconEnabled={ArrowRightIcon}
										iconPosition={"right"}
										label={"Go to feed (button)"}
										size={"xl"}
										theme={"dark"}
									/>
								</LinkTo>
							}
						/>
					) : null}

					{feedCountQuery.data.filter > 0 ? null : (
						<Status
							icon={FeedIcon}
							tone={"primary"}
							textTitle={"Your cart is empty - no feed (title)"}
							textMessage={"Your cart is empty - no feed (message)"}
							action={
								<LinkTo
									to={"/$locale/buyer/feed/wizard/location"}
									params={{
										locale,
									}}
								>
									<Button
										iconEnabled={ArrowRightIcon}
										iconPosition={"right"}
										label={"Go to feed wizard (button)"}
										size={"xl"}
										theme={"dark"}
									/>
								</LinkTo>
							}
						/>
					)}
				</Container>
			) : null}
		</Container>
	);
};
