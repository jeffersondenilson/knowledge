<template>
	<header class="header">
		<a class="toggle" @click="toggleMenu" v-if="showToggle">
			<i class="fa fa-lg" :class="icon"></i>
		</a>
		<h1 class="title">
			<router-link to="/">
				{{ title }}
			</router-link>
		</h1>
		<UserDropdown v-if="showUserDropdown" />
	</header>
</template>

<script>
	import UserDropdown from './UserDropdown';

	export default {
		name: 'Header',
		components: { UserDropdown },
		props: {
			title: String,
			showToggle: Boolean,
			showUserDropdown: Boolean
		},
		computed: {
			icon(){
				return this.$store.state.isMenuVisible ? 
					'fa-angle-left' : 'fa-angle-down';
			}
		},
		methods: {
			toggleMenu(){
				this.$store.commit('toggleMenu');
			}
		}
	}
</script>

<style>
	.header {
		grid-area: header;
		background: linear-gradient(to right, #1e469a, #49a7c1);

		display: flex;
		justify-content: center;
		align-items: center;
	}

	.title {
		font-size: 1.2rem;
		color: #fff;
		font-weight: 100;
		flex-grow: 1;
		text-align: center;
	}

	.title a {
		color: #fff;
		text-decoration: none;
	}

	.title a:hover {
		color: #fff;
		text-decoration: none;
	}

	header.header > a.toggle {
		width: 60px;
		height: 100%;
		color: #fff;
		text-decoration: none;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	header.header > a.toggle:hover {
		background-color: rgba(0, 0, 0, 0.2);
	}
</style>