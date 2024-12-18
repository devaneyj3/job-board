import { GraphQLClient } from "graphql-request";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { getAccessToken } from "../auth";

const client = new GraphQLClient("http://localhost:9000/graphql", {
	headers: () => {
		const accessToken = getAccessToken();
		if (accessToken) {
			return { Authorization: `Bearer ${accessToken}` };
		}
		return {};
	},
});

const apolloClient = new ApolloClient({
	uri: "http://localhost:9000/graphql",
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
	const { job } = await client.request(mutation, {
		input: { title, description },
	});
	return job;
}

export async function deletJob(id) {
	const mutation = gql`
		mutation {
			deleteJob(id: id) {
				title
			}
		}
	`;
	const { job } = await client.request(mutation, id);
	return job;
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
	const { data } = await apolloClient.query({ query, variable: { id } });
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
		query {
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
