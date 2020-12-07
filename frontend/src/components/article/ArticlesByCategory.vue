<template>
	<div class="articles-by-category">
		<PageTitle
			icon="fa fa-folder-o"
			:title="category.name"
			subtitle="Categoria"
		/>
		<!-- TODO: card -->
		<!-- <ul>
			<li v-for="article in articles" :key="article.id">
				{{ article.name }}
			</li>
		</ul> -->
		<ArticleItem v-for="article in articles" :key="article.id" :article="article" />

		<div class="load-more">
			<button
				v-if="loadMore"
				class="btn btn-lg btn-outline-primary"
				@click="getArticles"
			>
				Ver Mais Artigos
			</button>
			<span v-else class="text-lg text-secondary">
				Sem mais artigos
			</span>
		</div>
	</div>
</template>

<script>
import { baseApiUrl, showError } from "@/config/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
import ArticleItem from "./ArticleItem";

export default {
	name: "ArticlesByCategory",
	components: { PageTitle, ArticleItem },
	data: function() {
		return {
			category: {},
			articles: [],
			page: 1,
			loadMore: true
		};
	},
	methods: {
		getCategory() {
			axios
				.get(`${baseApiUrl}/categories/${this.category.id}`)
				.then(res => (this.category = res.data))
				.catch(showError);
		},
		getArticles() {
			axios(
				`${baseApiUrl}/categories/${this.category.id}/articles?page=${this.page}&limit=10`
			)
				.then(res => {
					this.articles = this.articles.concat(res.data);
					this.page++;
					if (res.data.length === 0) this.loadMore = false;
				})
				.catch(showError);
		}
	},
	mounted() {
		this.category.id = this.$route.params.id;
		this.getCategory();
		this.getArticles();
	}
};
</script>

<style>
.articles-by-category .load-more {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 25px;
}

.articles-by-category .text-lg {
	font-size: 1.2rem;
}
</style>
