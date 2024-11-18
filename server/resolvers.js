export const resolvers = {
	Query: {
		job: () => {
			return {
				id: "Test ID",
				title: "The Title",
				description: "The Description",
			};
		},
	},
};
