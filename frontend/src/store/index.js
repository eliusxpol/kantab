import Vue from "vue";
import Vuex from "vuex";
import authenticator from "../authenticator";
import { apolloClient } from "../apollo";
import gql from "graphql-tag";

Vue.use(Vuex);

import axios from "axios";
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add a response interceptor
axios.interceptors.response.use(
	response => {
		// Do something with response data
		return response.data;
	},
	error => {
		// Forbidden, need to relogin
		if (error.response && error.response.status == 401) {
			authenticator.logout();
			return Promise.reject(error);
		}

		// Do something with response error
		if (error.response && error.response.data) return Promise.reject(error.response.data);

		return Promise.reject(error);
	}
);

export default new Vuex.Store({
	state: {
		// Logged in user entity
		user: null,
		providers: [],
		board: null,
		boards: []
	},

	getters: {},

	actions: {
		async init({ dispatch }) {
			try {
				await dispatch("getMe");
				await dispatch("getSupportedSocialAuthProviders");
			} catch (err) {
				console.log("Error", err);
				//Raven.captureException(err);
			}
			//commit("READY");

			/*if (state.profile && state.profile._id) {
				this._vm.$ga.set("userId", state.profile._id);
			}*/
		},

		async getMe({ commit }) {
			const user = await axios.get("/api/v1/accounts/me");
			commit("SET_LOGGED_IN_USER", user);

			/*if (process.env.NODE_ENV == "production") {
				Raven.setUserContext(user);
				LogRocket.identify(user._id, user);
			}*/

			return user;
		},

		async getMeApollo({ commit }) {
			const user = await apolloClient.query({
				query: gql`
					query {
						me {
							id
							username
							fullName
							email
						}
					}
				`
			});
			//commit("SET_LOGGED_IN_USER", user.data.me);
			return user.data.me;
		},
		async getBoard({ commit }, id) {
			const res = await apolloClient.query({
				query: gql`
					query board($id: String!) {
						board(id: $id) {
							id
							title
							slug
							description
							position
							archived
							public
						}
					}
				`,
				variables: { id }
			});
			commit("SET_BOARD", res.data.board);
			return res.data.board;
		},

		async getBoards({ commit }) {
			const res = await apolloClient.query({
				query: gql`
					query {
						boards {
							id
							title
							description
							createdAt
							updatedAt
							owner {
								username
								fullName
								boards {
									title
								}
							}
						}
					}
				`
			});
			commit("SET_BOARDS", res.data.boards);
			return res.data.boards;
		},

		async createBoard({ commit }, input) {
			// Call to the graphql mutation
			apolloClient
				.mutate({
					// Query
					mutation: gql`
						mutation createBoard($input: CreateBoardInput!) {
							createBoard(input: $input) {
								id
								title
								description
							}
						}
					`,

					// Parameters
					variables: input
				})
				.then(async data => {
					// Result
					commit("ADD_BOARD", data.data.createBoard);
				})
				.catch(error => {
					// Error
					console.error(error);
				});
		},

		async removeBoard({ commit }, id) {
			// Call to the graphql mutation
			apolloClient
				.mutate({
					// Query
					mutation: gql`
						mutation removeBoard($id: String!) {
							removeBoard(id: $id)
						}
					`,

					// Parameters
					variables: { id }
				})
				.then(async data => {
					// Result
					commit("REMOVE_BOARD", data.data.removeBoard);
				})
				.catch(error => {
					// Error
					console.error(error);
				});
		},
		async updateBoard({ commit }, input) {
			// Call to the graphql mutation

			try {
				const res = await apolloClient.mutate({
					// Query
					mutation: gql`
						mutation updateBoard($input: UpdateBoardInput!) {
							updateBoard(input: $input) {
								id
								title
								description
							}
						}
					`,

					// Parameters
					variables: input
				});
				console.log("vue.proto", Vue.prototype);
				//Vue.prototype.$toast.prototype.show("Welcome!", "Hey");
				commit("UPDATE_BOARD", res.data.updateBoard);
			} catch (error) {
				console.error(error);
			}
		},

		async getSupportedSocialAuthProviders({ commit }) {
			const providers = await axios.get("/auth/supported-social-auth-providers");
			commit("SET_AUTH_PROVIDERS", providers);

			return providers;
		},

		async unlinkSocial({ commit }, provider) {
			const user = await axios.get(`/api/v1/accounts/unlink?provider=${provider}`);
			commit("SET_LOGGED_IN_USER", user);

			return user;
		},

		logout({ commit }) {
			commit("LOGOUT");
		}
	},

	mutations: {
		SET_LOGGED_IN_USER(state, user) {
			state.user = user;
		},

		SET_AUTH_PROVIDERS(state, providers) {
			state.providers = providers;
		},
		SET_BOARD(state, board) {
			state.board = board;
		},
		SET_BOARDS(state, boards) {
			state.boards = boards;
		},
		ADD_BOARD(state, board) {
			state.boards.push(board);
		},
		UPDATE_BOARD(state, board) {
			const found = state.boards.find(b => b.id == board.id);
			if (found) {
				Object.assign(found, board);
			} else {
				state.boards.push(board);
			}
		},
		REMOVE_BOARD(state, id) {
			const ix = state.boards.findIndex(b => b.id === id);
			if (ix >= 0) state.boards.splice(ix, 1);
		},

		LOGOUT(state) {
			state.user = null;
		}
	}
});
