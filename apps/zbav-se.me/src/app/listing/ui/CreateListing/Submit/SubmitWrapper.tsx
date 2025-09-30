import {
	Badge,
	Button,
	Data,
	Icon,
	Sheet,
	SpinnerIcon,
	Status,
	Tx,
	type useSelection,
} from "@use-pico/client";
import { AnimatePresence, motion } from "motion/react";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";

export namespace SubmitWrapper {
	export interface Props {
		canSubmit: boolean;
		categorySelection: useSelection.Selection<CategorySchema.Type>;
	}
}

export const SubmitWrapper: FC<SubmitWrapper.Props> = ({
	canSubmit,
	categorySelection,
}) => {
	const categoryQuery = withCategoryListQuery().useQuery(
		{
			filter: {
				idIn: categorySelection.optional.multiId(),
			},
		},
		{
			enabled: canSubmit,
		},
	);

	return canSubmit ? (
		<AnimatePresence mode={"wait"}>
			<Data
				result={categoryQuery}
				renderLoading={() => {
					return (
						<motion.div
							key={`submit-wrapper-loading`}
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
							key={`submit-wrapper-success`}
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
							<Sheet tone={"secondary"}>
								<Status
									icon={SendPackageIcon}
									textTitle={
										<Tx
											label={
												"Submit listing - status (title)"
											}
										/>
									}
									tone={"secondary"}
								>
									<div className="inline-flex flex-row gap-2 w-full">
										{data.map((item) => {
											return (
												<Badge
													key={`submit-wrapper-badge-${item.id}`}
													tone={"secondary"}
													theme={"light"}
													size={"lg"}
												>
													<Tx
														label={`Category ${item.name}`}
													/>
												</Badge>
											);
										})}
									</div>

									<Button
										iconEnabled={CheckIcon}
										tone={"secondary"}
										theme={"dark"}
										size={"xl"}
									>
										<Tx label={"Submit listing (button)"} />
									</Button>
								</Status>
							</Sheet>
						</motion.div>
					);
				}}
			/>
		</AnimatePresence>
	) : (
		<Sheet
			tone={"warning"}
			disabled
		>
			<Status
				icon={SendPackageIcon}
				textTitle={
					<Tx
						label={
							"Submit listing - status - cannot submit (title)"
						}
						tone={"warning"}
						theme={"light"}
					/>
				}
				tone={"warning"}
			/>
		</Sheet>
	);
};
