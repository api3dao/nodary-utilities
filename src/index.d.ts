import * as api3Contracts from "@api3/contracts";

export { api3Contracts };

export const nodaryAirnodeAddress: string;
export const nodaryXPub: string;

export interface NodaryFeed {
  name: string;
  deviationThresholdsInPercentages: number[];
}

export const nodaryFeeds: NodaryFeed[];

export function nodaryChainIds(): string[];
export function computeEndpointId(endpointName: string): string;
export function computeTemplateId(feedName: string): string;
export function computeFeedId(feedName: string): string;
export function computeSponsorWalletAddress(
  feedName: string,
  deviationThreshold: number,
  deviationReference: number,
  heartbeatInterval: number
): string;
