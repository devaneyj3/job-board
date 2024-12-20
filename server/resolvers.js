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
		createJob: (_root, { input: { title, description } }, { user }) => {
			if (!user) {
				throw new unathorizedError("Missing Authentication");
			}
			return createJob({ companyId: user.companyId, title, description });
		},
		deleteJob: async (_root, { id }, { user }) => {
			if (!user) {
				throw new unathorizedError("Missing Authentication");
			}
			const job = await deleteJob(id, user.companyId);
			if (!job) {
				throw NotFound("No Job found with id: " + id);
			}
			return job;
		},
		updateJob: async (
			_root,
			{ input: { id, title, description } },
			{ user }
		) => {
			if (!user) {
				throw new unathorizedError("Missing Authentication");
			}
			const updatedJob = await updateJob({
				id,
				title,
				description,
				companyId: user.companyId,
			});
			if (!updatedJob) {
				throw NotFound("No Job found with id: " + id);
			}
			return job;
		},
	},

	Company: {
		jobs: (company) => getJobsByCompany(company.id),
	},

	Job: {
		company: (companyId, _args, { companyLoader }) => {
			return companyLoader.load(companyId);
		},
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

function unathorizedError(message) {
	throw new GraphQLError(message, {
		extensions: { code: "UNAUTHORIZED	" },
	});
}
