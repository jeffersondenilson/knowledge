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
							required
							autocomplete="off"
							placeholder="Informe o E-mail do Usuário..."
						/>
					</b-form-group>
				</b-col>
			</b-row>
			<b-row>
				<b-form-checkbox id="user-admin" v-model="user.admin" class="m-3">
					Administrador?
				</b-form-checkbox>
			</b-row>
			<b-row>
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
					<b-form-group label="Confirmar Senha:" label-for="user-confirm-password">
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
		</b-form>

		<b-table hover striped responsive :items="users" :fields="fields"></b-table>
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
				.get(`${baseApiUrl}/users`)
				.then(res => {
					this.users = res.data.data;
				})
				.catch(err => showError(err));
		}
	},
	mounted() {
		this.loadUsers();
	}
};
</script>
