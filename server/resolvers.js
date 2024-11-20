import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { getJob, getJobs, getJobsByCompany } from "./db/jobs.js";
export const resolvers = {
	Query: {
		job: async (_root, { id }) => {
			const job = await getJob(id);
			if (!job) {
				throw NotFound("No Job with id: " + id);
			}
			return job;
		},
		jobs: () => getJobs(),
		company: async (_root, { id }) => {
			const company = await getCompany(id);
			if (!company) {
				throw NotFound("No Company with id: " + id);
			}
			return company;
		},
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

function NotFound(message) {
	throw new GraphQLError(message, {
		extensions: { code: "NOT_FOUND" },
	});
}
