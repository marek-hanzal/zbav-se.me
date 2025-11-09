import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import type { tCategoryCart } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";
import { CategoryInline } from "~/app/category/ui/CategoryInline";

export namespace CategoryCartListContainer {
	export interface Props extends Container.Props {
		categoryCartList: tCategoryCart[];
	}
}

export const CategoryCartListContainer: FC<CategoryCartListContainer.Props> = ({
	categoryCartList,
	...props
}) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<Container
			layout={"vertical-flex"}
			gap={"sm"}
			{...props}
		>
			{categoryCartList.map((category) => (
				<LinkTo
					key={category.id}
					to={"/$locale/buyer/cart/$categoryId/feed"}
					params={{
						locale,
						categoryId: category.id,
					}}
					display={"block"}
					tone={"primary"}
					full
				>
					<Badge
						ui={"CategoryCartListContainer-badge"}
						round={"md"}
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
										"round.md",
										"square.md",
									],
								},
							},
						}}
					>
						<CategoryInline category={category} />

						<div className="inline-flex flex-row gap-2 items-center">
							<Typo
								label={`${category.listingCount}x`}
								font={"bold"}
							/>

							<Icon icon={ArrowRightIcon} />
						</div>
					</Badge>
				</LinkTo>
			))}
		</Container>
	);
};
