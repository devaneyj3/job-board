import {
	companyById,
	getJobIdQuery,
	getJobsQuery,
	createJobMutation,
} from "./queries";
import { useQuery, useMutation } from "@apollo/client";

export function useCompany(id) {
	const { data, loading, error } = useQuery(companyById, {
		variables: { id: id },
	});
	return {
		company: data?.company,
		loading,
		error: Boolean(error),
	};
}
export function useJobs() {
	const { data, loading, error } = useQuery(getJobsQuery, {
		fetchPolicy: "network-only",
	});
	return {
		jobs: data?.jobs,
		loading,
		error: Boolean(error),
	};
}
export function useJob(id) {
	const { data, loading, error } = useQuery(getJobIdQuery, {
		variables: { id: id },
	});
	return {
		job: data?.job,
		loading,
		error: Boolean(error),
	};
}
export function useCreateJob() {
	const [mutate, { loading }] = useMutation(createJobMutation);

	const createJob = async (title, description) => {
		const {
			data: { job },
		} = await mutate({
			variables: { input: { title, description } },
			update: (cache, { data }) => {
				cache.writeQuery({
					query: getJobIdQuery,
					variables: { id: data.job.id },
					data,
				});
			},
		});
		return job;
	};
	return {
		loading,
		createJob,
	};
}
