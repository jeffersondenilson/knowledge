<template>
	<div class="category-admin">
		<b-form>
			<b-row>
				<b-col md="6" sm="12">
					<b-form-group label="Nome:" label-for="category-name">
						<b-form-input
							id="category-name"
							type="text"
							v-model="category.name"
							:readonly="mode === 'remove'"
							required
							autocomplete="off"
							placeholder="Informe o Nome da Categoria..."
						/>
					</b-form-group>
				</b-col>
				<b-col>
					<!-- TODO: SELECT -->
					<b-form-group label="Categoria pai:" label-for="category-parent">
						<b-form-input
							id="category-parent"
							type="email"
							v-model="category.path"
							:readonly="mode === 'remove'"
							autocomplete="off"
							placeholder="Informe o Nome da Categoria pai..."
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row v-show="mode === 'remove'">
				<b-col>
					<b-alert variant="danger">
						<i class="fa fa-exclamation-triangle"></i> 
			      Excluir uma categoria irá excluir todas as subcategorias e artigos contidos nela!
			    </b-alert>
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

		<b-table hover striped :items="categories" :fields="fields" id="categories-table">
			<template #cell(actions)="data">
				<b-button variant="warning" @click="loadCategory(data.item)" class="mr-2">
					<i class="fa fa-pencil"></i>
				</b-button>
				<b-button variant="danger" @click="loadCategory(data.item, 'remove')">
					<i class="fa fa-trash"></i>
				</b-button>
			</template>
		</b-table>

		<b-pagination
      v-model="page"
      :total-rows="count"
      :per-page="limit"
      @click="test"
      aria-controls="categories-table"
    ></b-pagination>
	</div>
</template>

<script>
import axios from "axios";
import { baseApiUrl, showError } from "@/config/global";

export default {
	name: "CategoryAdmin",
	data: function() {
		return {
			mode: "save",
			category: {},
			categories: [],
			count: 0,
			page: 1,
			limit: 10,
			fields: [
				{ key: "id", label: "Código", sortable: true },
				{ key: "name", label: "Nome", sortable: true },
				{ key: "actions", label: "Ações" }
			]
		};
	},
	methods: {
		// TODO: remover @click
		test(){
			console.log('page');
		},
		loadCategories() {
			axios
				.get(`${baseApiUrl}/categories?page=${this.page}&limit=${this.limit}`)
				.then(res => {
					console.log(res.data.categories)
					this.categories = res.data.categories;
					this.count = res.data.count;
				})
				.catch(showError);
		},
		loadCategory(category, mode = "save") {
			this.mode = mode;
			this.category = { ...category };
		},
		reset() {
			this.mode = "save";
			this.category = {};
			this.loadCategories();
		},
		save() {
			const method = this.category.id ? "put" : "post";
			const id = this.category.id ? `/${this.category.id}` : "";
			axios[method](`${baseApiUrl}/categories${id}`, this.category)
				.then(res => {
					this.$toasted.global.defaultSuccess({
						msg: "Categoria salva"
					});
					this.reset();
				})
				.catch(showError);
		},
		remove() {
			axios
				.delete(`${baseApiUrl}/categories/${this.category.id}`)
				.then(res => {
					this.$toasted.global.defaultSuccess({
						msg: "Categoria excluída"
					});
					this.reset();
				})
				.catch(showError);
		}
	},
	mounted() {
		this.loadCategories();
	},
	watch: {
		page(){
			this.loadCategories();
		},
		limit(){
			this.loadCategories();
		}
	}
};
</script>
