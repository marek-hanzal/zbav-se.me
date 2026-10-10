import { getLogger } from "@logtape/logtape";
import { RootLoggerName } from "~/log/constant/RootLoggerName";

type Category =
	| string
	| [
			string,
	  ]
	| [
			string,
			...string[],
	  ];

export const getRootLoggerFn = (category?: Category) => {
	const logger = getLogger(RootLoggerName);

	return category ? logger.getChild(category) : logger;
};
