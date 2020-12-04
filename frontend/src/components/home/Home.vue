<template>
	<div class="home">
		<PageTitle
			icon="fa fa-home"
			title="Dashboard"
			subtitle="Base de Conhecimento"
		/>
		<div class="stats">
			<Stat
				title="Categorias"
				:value="stats.categories"
				icon="fa fa-folder"
				color="#d54d50"
			/>
			<Stat
				title="Artigos"
				:value="stats.articles"
				icon="fa fa-file"
				color="#3bc480"
			/>
			<Stat
				title="Usuários"
				:value="stats.users"
				icon="fa fa-user"
				color="#3282cd"
			/>
		</div>
	</div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import Stat from "./Stat";
import axios from "axios";
import { baseApiUrl } from "@/config/global";

export default {
	name: "Home",
	components: { PageTitle, Stat },
	data: function() {
		return {
			stats: {}
		};
	},
	methods: {
		getStats() {
			axios
				.get(`${baseApiUrl}/stats`)
				.then(res => (this.stats = res.data))
				.catch(err => showError(err));
		}
	},
	mounted() {
		this.getStats();
	}
};
</script>


<style>
	.stats {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
</style>