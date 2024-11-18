import { getJobs } from "./db/jobs.js";
export const resolvers = {
	Query: {
		jobs: () => getJobs(),
	},

	Job: {
		date: ({ createdAt }) => toIsoDate(createdAt),
	},
};

function toIsoDate(value) {
	return value.slice(0, "yyyy-mm-dd".length);
}
