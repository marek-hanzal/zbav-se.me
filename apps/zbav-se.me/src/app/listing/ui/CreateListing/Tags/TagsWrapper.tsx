import {
	Data,
	Icon,
	Snapper,
	SnapperContent,
	SnapperItem,
	SnapperNav,
	SpinnerIcon,
} from "@use-pico/client";
import { AnimatePresence, motion } from "motion/react";
import type { FC } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { TagSelection } from "~/app/listing/ui/CreateListing/Tags/TagSelection";
import { DotIcon } from "~/app/ui/icon/DotIcon";

export const TagsWrapper: FC = () => {
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
							className="h-full"
						>
							<Snapper orientation={"vertical"}>
								<SnapperNav
									pages={data.map((item) => ({
										id: item.id,
										icon: DotIcon,
									}))}
									iconProps={() => ({
										size: "xs",
										tone: "secondary",
									})}
								/>

								<SnapperContent>
									{data.map((item) => (
										<SnapperItem
											key={`snapper-item-${item.id}`}
										>
											<TagSelection
												categoryGroup={item}
											/>
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
