import {
	Data,
	Icon,
	Sheet,
	Snapper,
	SnapperContent,
	SnapperItem,
	SnapperNav,
	SpinnerIcon,
	Status,
	Tx,
	type useSelection,
} from "@use-pico/client";
import { AnimatePresence, motion } from "motion/react";
import type { FC } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { DotIcon } from "~/app/ui/icon/DotIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";

export namespace CategoryGroup {
	export interface Props {
		selection: useSelection.Selection<CategoryGroupSchema.Type>;
	}
}

export const CategoryGroup: FC<CategoryGroup.Props> = ({ selection }) => {
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
							key={`category-group-wrapper-loading`}
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
							key={`category-group-wrapper-success`}
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
										iconProps: () => ({
											tone: selection.isSelected(item.id)
												? "primary"
												: "secondary",
										}),
									}))}
									iconProps={() => ({
										size: "xs",
										tone: "secondary",
									})}
								/>

								<SnapperContent>
									{data.map((item) => {
										const isSelected = selection.isSelected(
											item.id,
										);

										return (
											<SnapperItem
												key={`snapper-item-${item.id}`}
											>
												<AnimatePresence mode={"wait"}>
													{isSelected ? (
														<motion.div
															key={`sheet-${item.id}-selected`}
															initial={{
																opacity: 0,
																x: 20,
															}}
															animate={{
																opacity: 1,
																x: 0,
															}}
															exit={{
																opacity: 0,
																x: -20,
															}}
															transition={{
																duration: 0.15,
															}}
															className="h-full"
														>
															<Sheet
																tone={
																	"secondary"
																}
																theme={"light"}
																onClick={() => {
																	selection.toggle(
																		item,
																	);
																}}
															>
																<Status
																	icon={
																		CheckIcon
																	}
																	tone={
																		"secondary"
																	}
																	theme={
																		"light"
																	}
																	textTitle={
																		<Tx
																			label={`Category group ${item.name}`}
																			tone={
																				"secondary"
																			}
																			theme={
																				"light"
																			}
																			font={
																				"bold"
																			}
																		/>
																	}
																	textMessage={
																		"Sem prijdou chipsy posledne nabidnutych inzeratu"
																	}
																/>
															</Sheet>
														</motion.div>
													) : (
														<motion.div
															key={`sheet-${item.id}-unselected`}
															initial={{
																opacity: 0,
																x: -20,
															}}
															animate={{
																opacity: 1,
																x: 0,
															}}
															exit={{
																opacity: 0,
																x: 20,
															}}
															transition={{
																duration: 0.15,
															}}
															className="h-full"
														>
															<Sheet
																tone={"primary"}
																theme={"light"}
																onClick={() => {
																	selection.toggle(
																		item,
																	);
																}}
															>
																<Status
																	icon={
																		TagIcon
																	}
																	tone={
																		"primary"
																	}
																	theme={
																		"light"
																	}
																	textTitle={
																		<Tx
																			label={`Category group ${item.name}`}
																			tone={
																				"primary"
																			}
																			theme={
																				"light"
																			}
																			font={
																				"bold"
																			}
																		/>
																	}
																	textMessage={
																		"Sem prijdou chipsy posledne nabidnutych inzeratu"
																	}
																/>
															</Sheet>
														</motion.div>
													)}
												</AnimatePresence>
											</SnapperItem>
										);
									})}
								</SnapperContent>
							</Snapper>
						</motion.div>
					);
				}}
			/>
		</AnimatePresence>
	);
};
