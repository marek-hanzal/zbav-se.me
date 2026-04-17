import { getLogger } from "@logtape/logtape";

type Category =
	| string
	| [
			string,
	  ]
	| [
			string,
			...string[],
	  ];

const RootLoggerName = "zbv";

export const getRootLogger = (category?: Category) => {
	const logger = getLogger(RootLoggerName);

	return category ? logger.getChild(category) : logger;
};
