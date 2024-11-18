import { getCompany } from "./db/companies.js";
import { getJobs } from "./db/jobs.js";
export const resolvers = {
	Query: {
		jobs: () => getJobs(),
	},

	Job: {
		company: ({ companyId }) => getCompany(companyId),
		date: ({ createdAt }) => toIsoDate(createdAt),
	},
};

function toIsoDate(value) {
	return value.slice(0, "yyyy-mm-dd".length);
}
