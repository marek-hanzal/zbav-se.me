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
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { DotIcon } from "~/app/ui/icon/DotIcon";
import { QuestionIcon } from "~/app/ui/icon/QuestionIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";

export namespace Category {
	export interface Props {
		categoryGroupSelection: useSelection.Selection<CategoryGroupSchema.Type>;
		categorySelection: useSelection.Selection<CategorySchema.Type>;
	}
}

export const Category: FC<Category.Props> = ({
	categoryGroupSelection,
	categorySelection,
}) => {
	const categoryQuery = withCategoryListQuery().useQuery(
		{
			filter: {
				categoryGroupIdIn: categoryGroupSelection.optional.multiId(),
			},
			sort: [
				{
					value: "sort",
					sort: "asc",
				},
			],
		},
		{
			enabled: categoryGroupSelection.hasAny,
		},
	);

	return (
		<AnimatePresence mode={"wait"}>
			{categoryGroupSelection.hasAny ? (
				<Data<CategorySchema.Type[], typeof categoryQuery>
					result={categoryQuery}
					renderLoading={() => {
						return (
							<motion.div
								key={`category-wrapper-loading`}
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
								key={`category-wrapper-success`}
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
												tone: categorySelection.isSelected(
													item.id,
												)
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
											const isSelected =
												categorySelection.isSelected(
													item.id,
												);

											return (
												<SnapperItem
													key={`snapper-item-${item.id}`}
												>
													<AnimatePresence
														mode={"wait"}
													>
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
																	theme={
																		"light"
																	}
																	onClick={() => {
																		categorySelection.toggle(
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
																				label={`Category ${item.name}`}
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
																	tone={
																		"primary"
																	}
																	theme={
																		"light"
																	}
																	onClick={() => {
																		categorySelection.toggle(
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
																				label={`Category ${item.name}`}
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
			) : (
				<motion.div
					key={`category-wrapper-empty`}
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
					<Sheet
						tone={"warning"}
						theme={"light"}
						disabled
					>
						<Status
							icon={QuestionIcon}
							tone={"warning"}
							theme={"light"}
							textTitle={
								<Tx
									label="No category selected"
									tone={"warning"}
									theme={"light"}
									font={"bold"}
								/>
							}
							textMessage={
								<Tx
									label={
										"Please select a category group first to see available categories"
									}
									tone={"warning"}
									theme={"light"}
								/>
							}
						/>
					</Sheet>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
