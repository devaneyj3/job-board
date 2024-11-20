import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
export const resolvers = {
	Query: {
		job: (_root, { id }) => getJob(id),
		jobs: () => getJobs(),
		company: (_root, { id }) => getCompany(id),
	},
	Company: {
		jobs: (company) => getJobsByCompany(company.id),
	},

	Job: {
		company: ({ companyId }) => getCompany(companyId),
		date: ({ createdAt }) => toIsoDate(createdAt),
	},
};

function toIsoDate(value) {
	return value.slice(0, "yyyy-mm-dd".length);
}
