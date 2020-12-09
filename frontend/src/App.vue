<template>
	<div id="app" :class="{ 'hide-menu': !isMenuVisible || !user }">
		<Header
			title="Base de Conhecimento"
			:showToggle="!!user"
			:showUserDropdown="!!user"
		/>
		<Menu v-if="user" />
		<Loading v-if="validatingToken" />
		<Content v-else />
	</div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/config/global";
import axios from "axios";
import { mapState } from "vuex";
import Header from "./components/template/Header";
import Menu from "./components/template/Menu";
import Content from "./components/template/Content";
import Loading from "./components/template/Loading";

export default {
	name: "App",
	components: { Header, Menu, Content, Loading },
	computed: mapState(["isMenuVisible", "user"]),
	data: function() {
		return {
			validatingToken: false
		};
	},
	methods: {
		async validateToken() {
			try {
				// loading
				this.validatingToken = true;

				const userData = JSON.parse(localStorage.getItem(userKey));
				// seta como null para trazer dados atualizados
				this.$store.commit("setUser", null);
				// TODO: manter userData quando recarregar a página
				// console.log(userData);
				// usuário não tem token, redirecionar para login
				if (userData === null) {
					this.validatingToken = false;
					this.$router.push({ name: "auth" });
					return;
				}

				const res = await axios.post(`${baseApiUrl}/validateToken`);

				if (res.data) {
					this.$store.commit("setUser", userData);
					// fecha o menu quando o usuário é logado em telas pequenas
					if (this.$mq === "xs" || this.$mq === "sm") {
						this.$store.commit("toggleMenu", false);
					}
				} else {
					localStorage.removeItem(userKey);
					this.$router.push({ name: "auth" });
				}
			} catch (e) {
				showError(e);
			} finally {
				this.validatingToken = false;
			}
		}
	},
	created() {
		this.validateToken();
	}
};
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
