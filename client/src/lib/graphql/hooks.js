import { companyById } from "./queries";
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
