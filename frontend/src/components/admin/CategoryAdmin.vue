<template>
	<div class="category-admin">
		<b-form>
			<b-row>
				<b-col>
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
			</b-row>
			<b-row>
				<b-col>
					<b-form-group label="Categoria pai:" label-for="category-parent">
						<b-form-select
							id="category-parent"
							v-model="category.parentId"
							:options="categoriesPaths"
						></b-form-select>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-col md="7">
					<b-alert
						variant="danger"
						:show="mode === 'remove'"
						style="font-size: 1.1rem;"
					>
						<i class="fa fa-lg fa-exclamation-triangle"></i>
						
						Excluir uma categoria irá excluir todas as subcategorias e artigos
						contidos nela!
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

		<b-table
			hover
			striped
			responsive
			:items="categories"
			:fields="fields"
			:per-page="limit"
			:current-page="page"
			id="categories-table"
		>
			<template #cell(actions)="data">
				<b-button
					variant="warning"
					@click="loadCategory(data.item)"
					class="mr-2 mb-2 mb-md-0"
				>
					<i class="fa fa-pencil"></i>
				</b-button>
				<b-button variant="danger" @click="loadCategory(data.item, 'remove')">
					<i class="fa fa-trash"></i>
				</b-button>
			</template>
		</b-table>

		<div class="pagination">
			<b-pagination
				v-model="page"
				:total-rows="count"
				:per-page="limit"
				aria-controls="categories-table"
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
				{ key: "path", label: "Caminho", sortable: true },
				{ key: "actions", label: "Ações" }
			]
		};
	},
	methods: {
		loadCategories() {
			axios
				.get(`${baseApiUrl}/categories`)
				.then(res => {
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
	computed: {
		categoriesPaths() {
			const paths = [
				{ value: null, text: "(Nenhuma)" },
				...this.categories.map(c => ({
					value: c.parentId,
					text: c.path
				}))
			];
			return paths;
		}
	},
	mounted() {
		this.loadCategories();
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
