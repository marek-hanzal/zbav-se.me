import { getLogger } from "@logtape/logtape";
import { RootLoggerName } from "./RootLoggerName";

type Category =
	| string
	| [
			string,
	  ]
	| [
			string,
			...string[],
	  ];

export const getRootLogger = (category?: Category) => {
	const logger = getLogger(RootLoggerName);

	return category ? logger.getChild(category) : logger;
};
