<template>
	<div class="w-full">
		<template v-if="providers && providers.length > 0">
			<hr class="w-full" />
			<div class="flex my-4 justify-between">
				<a v-if="isSupported('google')" class="google" href="/auth/google" title="Google">
					<svg
						aria-labelledby="simpleicons-google-icon"
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title id="simpleicons-google-icon">Sign In with Google</title>
						<path
							d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
						/>
					</svg>
				</a>
				<a
					v-if="isSupported('facebook')"
					class="facebook"
					href="/auth/facebook"
					title="Facebook"
				>
					<svg
						aria-labelledby="simpleicons-facebook-icon"
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title id="simpleicons-facebook-icon">Sign In with Facebook</title>
						<path
							d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.408.593 24 1.324 24h11.494v-9.294H9.689v-3.621h3.129V8.41c0-3.099 1.894-4.785 4.659-4.785 1.325 0 2.464.097 2.796.141v3.24h-1.921c-1.5 0-1.792.721-1.792 1.771v2.311h3.584l-.465 3.63H16.56V24h6.115c.733 0 1.325-.592 1.325-1.324V1.324C24 .593 23.408 0 22.676 0"
						/>
					</svg>
				</a>
				<a v-if="isSupported('github')" class="github" href="/auth/github" title="Github">
					<svg
						aria-labelledby="simpleicons-github-icon"
						role="img"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title id="simpleicons-github-icon">Sign In with GitHub</title>
						<path
							d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
						/>
					</svg>
				</a>
			</div>
			<hr class="w-full" />
		</template>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	computed: {
		...mapState("auth", ["providers"])
	},

	methods: {
		isSupported(provider) {
			return !!this.providers.find(o => o == provider);
		}
	}
};
</script>

<style lang="scss" scoped>
a {
	svg {
		width: 48px;
		height: 48px;
		transform: scale(1);
		transition: transform 0.2s ease-in-out;

		&:hover {
			transform: scale(1.2);
		}
	}

	&.google svg path {
		fill: #dc4e41;
	}

	&.facebook svg path {
		fill: #3b5998;
	}

	&.twitter svg path {
		fill: #1da1f2;
	}

	&.github svg path {
		fill: white;
	}
}
</style>
