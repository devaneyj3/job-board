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
const apolloClient = new ApolloClient({
	link: concat(authLink, httpLink),
	cache: new InMemoryCache(),
});

export async function createJob({ title, description }) {
	const mutation = gql`
		mutation CreateJob($input: CreateJobInput!) {
			job: createJob(input: $input) {
				id
			}
		}
	`;
	const { data } = await apolloClient.mutate({
		mutation,
		variables: { input: { title, description } },
	});
	console.log(data.job);
	return data.job;
}

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
export async function getJob(id) {
	const query = gql`
		query jobById($id: ID!) {
			job(id: $id) {
				id
				title
				date
				description
				company {
					id
					name
				}
			}
		}
	`;
	const { data } = await apolloClient.query({ query, variables: { id } });
	return data.job;
}
export async function getCompany(id) {
	const query = gql`
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
	const { data } = await apolloClient.query({ query, variable: { id } });
	return data.company;
}
export async function getJobs() {
	const query = gql`
		query Jobs {
			jobs {
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
	const { data } = await apolloClient.query({ query });
	return data.jobs;
}
