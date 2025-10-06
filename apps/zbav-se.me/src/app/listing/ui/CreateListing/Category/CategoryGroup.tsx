import { Data, Icon, SpinnerIcon, type useSelection } from "@use-pico/client";
import type { FC } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";

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
		<Data
			result={categoryGroupQuery}
			renderLoading={() => {
				return (
					<div
						key={`category-group-wrapper-loading`}
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
						key={`category-group-wrapper-success`}
						className="h-full"
					>
						{/* <Container layout={"vertical"}>
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
                        orientation={"vertical"}
                    />

                    <Container
                        layout={"vertical-full"}
                        overflow={"vertical"}
                    >
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
                    </Container>
                </Container> */}
					</div>
				);
			}}
		/>
	);
};
