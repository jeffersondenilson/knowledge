<template>
	<!-- <div class="article-item">
		<router-link :to="`/articles/${article.id}`">
			<div class="article-item-image d-none d-sm-block">
				<img v-if="article.imageUrl" :src="article.imageUrl" height="150" width="150" alt="Article">
				<img v-else src="@/assets/article.png" height="150" width="150" alt="Article">
			</div>
			<div class="article-item-info">
				<h2>{{ article.name }}</h2>
				<p>{{ article.description }}</p>
				<span class="article-item-author">
					<strong>Autor: </strong>{{ article.author }}
				</span>
			</div>
		</router-link>
	</div> -->
		<b-card class="article-item">
			<router-link :to="`/articles/${article.id}`">
		    <b-row>
		      <b-col class="article-item-img">
		        <b-card-img v-if="article.imageUrl" :src="article.imageUrl" alt="Article"></b-card-img>
		        <b-card-img v-else :src="require('@/assets/article.png')" alt="Article"></b-card-img>
		      </b-col>
		      <b-col>
		        <!-- <b-card-body :title="article.name">
		          <b-card-text class="article-item-body">
		            {{ article.description }}
		            <span class="article-author">
		            	<strong>Autor: </strong>{{ article.author }}
		            </span>
		          </b-card-text>
		        </b-card-body> -->
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

	.article-item-author {
		margin: 5px;
	}
</style>