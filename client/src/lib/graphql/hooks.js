import { companyById, getJobIdQuery, getJobsQuery } from "./queries";
import { useQuery } from "@apollo/client";

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
