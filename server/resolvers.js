import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import {
	createJob,
	deleteJob,
	getJob,
	getJobs,
	getJobsByCompany,
	updateJob,
} from "./db/jobs.js";
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
	Mutation: {
		createJob: (_root, { input: { title, description } }) => {
			const companyId = "FjcJCHJALA4i";
			return createJob({ companyId, title, description });
		},
		deleteJob: (_root, { id }) => {
			return deleteJob(id);
		},
		updateJob: (_root, { input: { id, title, description } }) => {
			return updateJob({ id, title, description });
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
