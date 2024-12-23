import {
	ApolloClient,
	ApolloLink,
	concat,
	createHttpLink,
	gql,
	InMemoryCache,
} from "@apollo/client";
import { getAccessToken } from "../auth";

const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });

const authLink = new ApolloLink((operation, forward) => {
	const accessToken = getAccessToken();
	if (accessToken) {
		operation.setContext({
			headers: { Authorization: `Bearer ${accessToken}` },
		});
	}
	return forward(operation);
});
export const apolloClient = new ApolloClient({
	link: concat(authLink, httpLink),
	cache: new InMemoryCache(),
});

const jobDetailFragment = gql`
	fragment JobDetail on Job {
		id
		title
		date
		description
		company {
			id
			name
		}
	}
`;
export const getJobIdQuery = gql`
	query jobById($id: ID!) {
		job(id: $id) {
			...JobDetail
		}
	}
	${jobDetailFragment}
`;

export const companyById = gql`
	query Company($id: ID!) {
		company(id: $id) {
			id
			name
			description
			jobs {
				id
				title
				description
				date
			}
		}
	}
`;

export const getJobsQuery = gql`
	query Jobs($limit: Int, $offset: Int) {
		jobs(limit: $limit, offset: $offset) {
			id
			title
			date
			company {
				id
				name
			}
		}
	}
`;

export const createJobMutation = gql`
	mutation CreateJob($input: CreateJobInput!) {
		job: createJob(input: $input) {
			...JobDetail
		}
	}
	${jobDetailFragment}
`;

export async function deletJob(id) {
	const mutation = gql`
		mutation {
			deleteJob(id: id) {
				title
			}
		}
	`;
	const { data } = await apolloClient.mutate({
		mutation,
		variables: { id },
	});
	return data.job;
}
