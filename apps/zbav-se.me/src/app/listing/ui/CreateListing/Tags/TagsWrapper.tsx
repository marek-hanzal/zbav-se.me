import {
	Data,
	Icon,
	Snapper,
	SnapperContent,
	SnapperItem,
	SnapperNav,
	SpinnerIcon,
	Tx,
} from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { AnimatePresence, motion } from "motion/react";
import type { FC } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { DotIcon } from "~/app/ui/icon/DotIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import { Title } from "~/app/ui/title/Title";
import type { TitleCls } from "~/app/ui/title/TitleCls";

export namespace TagsWrapper {
	export interface Props {
		subtitleVariant?: Cls.VariantsOf<TitleCls>;
	}
}

export const TagsWrapper: FC<TagsWrapper.Props> = ({
	subtitleVariant = {
		tone: "secondary",
		size: "lg",
	},
}) => {
	const categoryGroupQuery = withCategoryGroupListQuery().useQuery({
		sort: [
			{
				value: "sort",
				sort: "asc",
			},
		],
	});

	return (
		<AnimatePresence mode={"wait"}>
			<Data<CategoryGroupSchema.Type[], typeof categoryGroupQuery>
				result={categoryGroupQuery}
				renderLoading={() => {
					return (
						<motion.div
							key={`tags-wrapper-loading`}
							className="flex justify-center items-center h-full"
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
							}}
						>
							<Icon
								icon={SpinnerIcon}
								theme={"dark"}
								tone={"secondary"}
								size={"xl"}
							/>
						</motion.div>
					);
				}}
				renderSuccess={({ data }) => {
					return (
						<motion.div
							key={`tags-wrapper-success`}
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
							}}
							className="flex justify-center items-center h-full"
						>
							<Snapper orientation={"horizontal"}>
								<SnapperNav
									pages={data.map((item) => ({
										id: item.id,
										icon: DotIcon,
										iconProps: {
											size: "sm",
										},
									}))}
									limit={{
										limit: 6,
									}}
								/>

								<SnapperContent>
									{data.map((item) => (
										<SnapperItem
											key={`snapper-item-${item.id}`}
										>
											<Title
												icon={TagIcon}
												{...subtitleVariant}
											>
												<Tx label={item.name} />
											</Title>
										</SnapperItem>
									))}
								</SnapperContent>
							</Snapper>
						</motion.div>
					);
				}}
			/>
		</AnimatePresence>
	);
};
