import {
	Data,
	Icon,
	Sheet,
	SpinnerIcon,
	Status,
	Tx,
	useSelection,
} from "@use-pico/client";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { QuestionIcon } from "~/app/ui/icon/QuestionIcon";

export const Category: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const setCategory = useCreateListingStore((store) => store.setCategory);
	const categoryGroupSelection = useCreateListingStore(
		(store) => store.categoryGroup,
	);
	const categorySelection = useSelection<CategorySchema.Type>({
		mode: "multi",
		onMulti: setCategory,
	});

	const categoryQuery = withCategoryListQuery().useQuery(
		{
			filter: {
				categoryGroupIdIn: categoryGroupSelection.map(
					(item) => item.id,
				),
			},
			sort: [
				{
					value: "sort",
					sort: "asc",
				},
			],
		},
		{
			enabled: categoryGroupSelection.length > 0,
		},
	);

	return categoryGroupSelection.length > 0 ? (
		<Data
			result={categoryQuery}
			renderLoading={() => {
				return (
					<div
						key={`category-wrapper-loading`}
						className="flex justify-center items-center h-full"
					>
						<Icon
							icon={SpinnerIcon}
							theme={"dark"}
							tone={"secondary"}
							size={"xl"}
						/>
					</div>
				);
			}}
			renderSuccess={({ data }) => {
				return (
					<div
						key={`category-wrapper-success`}
						className="h-full"
					>
						{/* <Container layout={"vertical-full"}>
                            <SnapperNav
                                orientation={"vertical"}
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
                        </Container> */}
					</div>
				);
			}}
		/>
	) : (
		<div
			key={`category-wrapper-empty`}
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
		</div>
	);
};
