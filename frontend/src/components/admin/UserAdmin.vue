<template>
	<div class="user-admin">
		<b-form>
			<b-row>
				<b-col md="6" sm="12">
					<b-form-group label="Nome:" label-for="user-name">
						<b-form-input
							id="user-name"
							type="text"
							v-model="user.name"
							:readonly="mode === 'remove'"
							required
							autocomplete="off"
							placeholder="Informe o Nome do Usuário..."
						/>
					</b-form-group>
				</b-col>
				<b-col md="6" sm="12">
					<b-form-group label="Email:" label-for="user-email">
						<b-form-input
							id="user-email"
							type="email"
							v-model="user.email"
							:readonly="mode === 'remove'"
							required
							autocomplete="off"
							placeholder="Informe o E-mail do Usuário..."
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-form-checkbox
					id="user-admin"
					v-model="user.admin"
					class="m-3"
					v-show="mode === 'save'"
				>
					Administrador?
				</b-form-checkbox>
			</b-row>
			<b-row v-show="mode === 'save'">
				<b-col md="6" sm="12">
					<b-form-group label="Senha:" label-for="user-password">
						<b-form-input
							id="user-password"
							type="password"
							v-model="user.password"
							required
							autocomplete="off"
							placeholder="Informe a Senha do Usuário..."
						/>
					</b-form-group>
				</b-col>
				<b-col md="6" sm="12">
					<b-form-group
						label="Confirmar Senha:"
						label-for="user-confirm-password"
					>
						<b-form-input
							id="user-confirm-password"
							type="password"
							v-model="user.confirmPassword"
							required
							autocomplete="off"
							placeholder="Confirme a Senha do Usuário..."
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

		<b-table hover striped :items="users" :fields="fields" id="users-table">
			<template #cell(actions)="data">
				<b-button
					variant="warning"
					@click="loadUser(data.item)"
					class="mr-2 mb-2 mb-md-0"
				>
					<i class="fa fa-pencil"></i>
				</b-button>
				<b-button variant="danger" @click="loadUser(data.item, 'remove')">
					<i class="fa fa-trash"></i>
				</b-button>
			</template>
		</b-table>

		<div class="pagination">
			<b-pagination
				v-model="page"
				:total-rows="count"
				:per-page="limit"
				aria-controls="users-table"
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
	name: "UserAdmin",
	data: function() {
		return {
			mode: "save",
			user: {},
			users: [],
			count: 0,
			page: 1,
			limit: 10,
			fields: [
				{ key: "id", label: "Código", sortable: true },
				{ key: "name", label: "Nome", sortable: true },
				{ key: "email", label: "E-mail", sortable: true },
				{
					key: "admin",
					label: "Administrador",
					sortable: true,
					formatter: value => (value ? "Sim" : "Não")
				},
				{ key: "actions", label: "Ações" }
			]
		};
	},
	methods: {
		loadUsers() {
			axios
				.get(`${baseApiUrl}/users?page=${this.page}&limit=${this.limit}`)
				.then(res => {
					this.users = res.data.users;
					this.count = res.data.count;
				})
				.catch(showError);
		},
		loadUser(user, mode = "save") {
			this.mode = mode;
			this.user = { ...user };
		},
		reset() {
			this.mode = "save";
			this.user = {};
			this.loadUsers();
		},
		save() {
			const method = this.user.id ? "put" : "post";
			const id = this.user.id ? `/${this.user.id}` : "";
			axios[method](`${baseApiUrl}/users${id}`, this.user)
				.then(res => {
					this.$toasted.global.defaultSuccess({
						msg: "Usuário salvo"
					});
					this.reset();
				})
				.catch(showError);
		},
		remove() {
			axios
				.delete(`${baseApiUrl}/users/${this.user.id}`)
				.then(res => {
					this.$toasted.global.defaultSuccess({
						msg: "Usuário excluído"
					});
					this.reset();
				})
				.catch(showError);
		}
	},
	mounted() {
		this.loadUsers();
	},
	watch: {
		page() {
			this.loadUsers();
		},
		limit() {
			this.loadUsers();
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
