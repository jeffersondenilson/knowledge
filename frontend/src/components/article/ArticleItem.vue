<template>
		<b-card class="article-item">
			<router-link :to="`/articles/${article.id}`">
		    <b-row>
		      <b-col class="article-item-img">
		        <b-card-img v-if="article.imageUrl" :src="article.imageUrl" alt="Article"></b-card-img>
		        <b-card-img v-else :src="require('@/assets/article.png')" alt="Article"></b-card-img>
		      </b-col>
		      <b-col>
		        <div class="article-item-info">
		        	<h2>{{ article.name }}</h2>
							<p>{{ article.description }}</p>
							<span class="article-item-author">
								<strong>Autor: </strong>{{ article.author }}
							</span>
		        </div>
		      </b-col>
		    </b-row>
			</router-link>
	  </b-card>
</template>

<script>
	export default {
		name: "ArticleItem",
		props: ["article"]
	}
</script>

<style>
	.article-item {
		margin: 10px 0px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
	}

	.article-item a {
		text-decoration: none;
		color: #000;
	}

	.article-item a:hover {
		text-decoration: none;
		color: #000;
	}

	.article-item-img {
		max-width: 150px;
		border-right: 2px solid gray;
	}

	.article-item-info {
		display: flex;
		flex-direction: column;
	}

	.article-item-info p {
		color: #555;
		font-size: 1.1rem;
	}

	.article-item-author {
		margin-top: 5px;
	}
</style>