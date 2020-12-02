<template>
	<div id="app" :class="{'hide-menu': !isMenuVisible}">
		<Header title="Base de Conhecimento" :showToggle="true" />
		<Menu />
		<Content />
	</div>
</template>

<script>
import { mapState } from 'vuex';
import Header from './components/template/Header';
import Menu from './components/template/Menu';
import Content from './components/template/Content';

export default {
	name: 'App',
	components: { Header, Menu, Content },
	computed: mapState(['isMenuVisible'])
}
</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		height: 100vh;
		display: grid;
		grid-template-rows: 60px 1fr;
		grid-template-columns: 300px 1fr;
		grid-template-areas: 
			"header header" 
			"menu content";
	}

	#app.hide-menu {
		grid-template-areas: 
			"header header" 
			"content content";
	}
</style>