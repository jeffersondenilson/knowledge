<template>
	<div class="article-by-id">
		<PageTitle
			icon="fa fa-file-o"
			:title="article.name"
			:subtitle="article.description"
		/>
		<div class="article-content" v-html="article.content"></div>
	</div>
</template>

<script>
import "highlight.js/styles/monokai-sublime.css";
import hljs from "highlight.js/lib/index";
import { baseApiUrl, showError } from "@/config/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
	name: "ArticleById",
	components: { PageTitle },
	data: function() {
		return {
			article: {}
		};
	},
	mounted() {
		axios
			.get(`${baseApiUrl}/articles/${this.$route.params.id}`)
			.then(res => (this.article = res.data))
			.catch(showError);
	},
	updated() {
		// highlight de código na tag pre
		document.querySelectorAll(".article-content pre").forEach(el => {
			hljs.highlightBlock(el);
		});
	}
};
</script>

<style>
.article-content {
	background-color: #fff;
	border-radius: 8px;
	padding: 25px;
}

.article-content pre {
	padding: 20px;
	border-radius: 8px;
	font-size: 1.1rem;
	background-color: #1e1e1e;
	color: #fff;
	max-width: 100%;
	overflow-x: auto;
}

.article-content img {
	max-width: 100%;
}

.article-content:last-child {
	margin-bottom: 0px;
}
</style>
