import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("http://localhost:9000/graphql");
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
	const data = await client.request(query, { id });
	return data.job;
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
	const data = await client.request(query);
	return data.jobs;
}
