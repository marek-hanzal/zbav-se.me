export const getAgentLiveSlotId = ({
	runId,
	outputIndex,
}: {
	runId: string;
	outputIndex: number;
}): string => {
	return `agent-live-${runId}-${outputIndex}`;
};
