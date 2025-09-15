import { Data, Icon, Sheet, SpinnerIcon, Status, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import { AnimatePresence, motion } from "motion/react";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import { Title } from "~/app/ui/title/Title";

export namespace TagSelection {
	export interface Props {
		categoryGroup: CategoryGroupSchema.Type;
	}
}

export const TagSelection: FC<TagSelection.Props> = ({ categoryGroup }) => {
	const categoryQuery = withCategoryListQuery().useQuery({
		where: {
			categoryGroupId: categoryGroup.id,
		},
		sort: [
			{
				value: "sort",
				sort: "asc",
			},
		],
	});

	return (
		<AnimatePresence mode={"wait"}>
			<Data<CategorySchema.Type[], typeof categoryQuery>
				result={categoryQuery}
				renderLoading={() => {
					return (
						<motion.div
							key={`tags-wrapper-loading-${categoryGroup.id}`}
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
							key={`tags-wrapper-success-${categoryGroup.id}`}
							initial={{
								opacity: 0,
							}}
							animate={{
								opacity: 1,
							}}
							exit={{
								opacity: 0,
							}}
							className={tvc([
								"h-full",
								"flex",
								"flex-col",
								"gap-2",
							])}
						>
							{data.map((item) => (
								<Title
									key={item.id}
									tone={"secondary"}
									size={"sm"}
								>
									<Tx label={`Category ${item.name}`} />
								</Title>
							))}
						</motion.div>
					);
				}}
			>
				{({ content }) => {
					return (
						<Sheet
							tone={"primary"}
							theme={"light"}
						>
							<Status
								icon={TagIcon}
								tone={"primary"}
								theme={"light"}
								textTitle={
									<Tx
										label={`Category group ${categoryGroup.name}`}
										tone={"primary"}
										theme={"light"}
										font={"bold"}
									/>
								}
							/>

							{/* {open && content} */}
						</Sheet>
					);
				}}
			</Data>
		</AnimatePresence>
	);
};
