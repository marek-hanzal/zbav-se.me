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

export const getRootLogger = (category?: Category) => {
	const logger = getLogger("zbav-se.me");

	return category ? logger.getChild(category) : logger;
};
