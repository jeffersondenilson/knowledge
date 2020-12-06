<template>
	<div class="article-admin">
		<b-form>
			<!-- TODO: remover b-row -->
			<b-row>
				<b-col>
					<b-form-group label="Nome:" label-for="article-name">
						<b-form-input
							id="article-name"
							type="text"
							v-model="article.name"
							:readonly="mode === 'remove'"
							required
							autocomplete="off"
							placeholder="Informe o Nome do Artigo..."
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
					<b-form-group label="Descrição:" label-for="article-description">
						<b-form-input
							id="article-description"
							type="text"
							v-model="article.description"
							:readonly="mode === 'remove'"
							required
							autocomplete="off"
							placeholder="Informe a descrição do Artigo..."
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col>
					<b-form-group label="Imagem (URL):" label-for="article-imageUrl">
						<b-form-input
							id="article-imageUrl"
							type="text"
							v-model="article.imageUrl"
							:readonly="mode === 'remove'"
							autocomplete="off"
							placeholder="Informe a URL da Imagem do Artigo..."
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row v-show="mode === 'save'">
				<b-col>
					<b-form-group label="Categoria:" label-for="article-categoryId">
						<b-form-select
							id="article-categoryId"
							v-model="article.categoryId"
							:options="categories"
							required
						></b-form-select>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row v-if="mode === 'save'">
				<b-col>
					<b-form-group label="Autor:" label-for="article-userId">
						<b-form-select
							id="article-userId"
							v-model="article.userId"
							:options="users"
							required
						></b-form-select>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row v-show="mode === 'save'">
				<b-col>
					<b-form-group label="Conteúdo" label-for="category-content">
						<VueEditor
							v-model="article.content"
							placeholder="Informe o Conteúdo do Artigo..."
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row class="mb-3">
				<b-col xs="12">
					<b-button variant="primary" v-show="mode === 'save'" @click="save">
						Salvar
					</b-button>
					<b-button variant="danger" v-show="mode === 'remove'" @click="remove">
						Excluir
					</b-button>
					<b-button class="ml-2" @click="reset">
						Cancelar
					</b-button>
				</b-col>
			</b-row>
		</b-form>

		<b-table
			hover
			striped
			responsive
			:items="articles"
			:fields="fields"
			id="articles-table"
		>
			<template #cell(actions)="data">
				<b-button
					variant="warning"
					@click="loadArticle(data.item)"
					class="mr-2 mb-2 mb-md-0"
				>
					<i class="fa fa-pencil"></i>
				</b-button>
				<b-button variant="danger" @click="loadArticle(data.item, 'remove')">
					<i class="fa fa-trash"></i>
				</b-button>
			</template>
		</b-table>

		<div class="pagination">
			<b-pagination
				v-model="page"
				:total-rows="count"
				:per-page="limit"
				aria-controls="articles-table"
			></b-pagination>
			<div>
				<span class="mx-3">Items por página: </span>
				<b-form-select
					v-model="limit"
					:options="[10, 20, 50, 100]"
					size="sm"
				></b-form-select>
			</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import { baseApiUrl, showError } from "@/config/global";
import { VueEditor } from "vue2-editor";

export default {
	name: "ArticleAdmin",
	components: { VueEditor },
	data: function() {
		return {
			mode: "save",
			article: {},
			articles: [],
			categories: [],
			users: [],
			count: 0,
			page: 1,
			limit: 10,
			fields: [
				{ key: "id", label: "Código", sortable: true },
				{ key: "name", label: "Nome", sortable: true },
				{ key: "description", label: "Descrição", sortable: true },
				{ key: "author", label: "Autor", sortable: true },
				{ key: "actions", label: "Ações" }
			]
		};
	},
	methods: {
		loadArticles() {
			axios
				.get(`${baseApiUrl}/articles?page=${this.page}&limit=${this.limit}`)
				.then(res => {
					this.articles = res.data.articles;
					this.count = res.data.count;
				})
				.catch(showError);
		},
		loadCategories() {
			axios
				.get(`${baseApiUrl}/categories`)
				.then(res => {
					this.categories = res.data.categories.map(category => ({
						value: category.id,
						text: category.path
					}));
				})
				.catch(showError);
		},
		loadUsers() {
			axios
				.get(`${baseApiUrl}/users`)
				.then(res => {
					this.users = res.data.users.map(user => ({
						value: user.id,
						text: `${user.name} (${user.email})`
					}));
				})
				.catch(showError);
		},
		loadArticle(article, mode = "save") {
			// carrega artigo com conteúdo
			this.mode = mode;
			axios.get(`${baseApiUrl}/articles/${article.id}`)
				.then(res => {
					this.article = res.data;	
				})
				.catch(showError);
		},
		reset() {
			this.mode = "save";
			this.article = {};
			this.loadArticles();
		},
		save() {
			const method = this.article.id ? "put" : "post";
			const id = this.article.id ? `/${this.article.id}` : "";
			axios[method](`${baseApiUrl}/articles${id}`, this.article)
				.then(res => {
					this.$toasted.global.defaultSuccess({
						msg: "Artigo salvo"
					});
					this.reset();
				})
				.catch(showError);
		},
		remove() {
			axios
				.delete(`${baseApiUrl}/articles/${this.article.id}`)
				.then(res => {
					this.$toasted.global.defaultSuccess({
						msg: "Artigo excluído"
					});
					this.reset();
				})
				.catch(showError);
		}
	},
	mounted() {
		this.loadArticles();
		this.loadCategories();
		this.loadUsers();
	},
	watch: {
		page() {
			this.loadArticles();
		},
		limit() {
			this.loadArticles();
		}
	}
};
</script>

<style>
.pagination {
	display: flex;
	flex-wrap: wrap;
}

.pagination select {
	width: 70px;
}
</style>
