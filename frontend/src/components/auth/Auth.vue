<template>
	<div class="auth-content">
		<div class="auth-modal">
			<img :src="require('@/assets/logo.png')" width="200" alt="Logo" />
			<hr />
			<div class="auth-title">
				{{ showSignUp ? "Cadastro" : "Login" }}
			</div>

			<b-form class="auth-form">
				<b-form-group v-if="showSignUp" label="Nome:" label-for="name">
					<b-form-input
						id="name"
						type="text"
						v-model="user.name"
						required
						autocomplete="off"
						placeholder="Nome"
					/>
				</b-form-group>
				<b-form-group label="E-mail:" label-for="email">
					<b-form-input
						id="email"
						type="text"
						v-model="user.email"
						required
						autocomplete="off"
						placeholder="E-mail"
					/>
				</b-form-group>
				<b-form-group label="Senha:" label-for="password">
					<b-form-input
						id="password"
						type="password"
						v-model="user.password"
						required
						autocomplete="off"
						placeholder="Senha"
					/>
				</b-form-group>
				<b-form-group
					v-if="showSignUp"
					label="Confirme a Senha:"
					label-for="confirm-password"
				>
					<b-form-input
						id="confirm-password"
						type="password"
						v-model="user.confirmPassword"
						required
						autocomplete="off"
						placeholder="Confirme a Senha"
					/>
				</b-form-group>
			</b-form>

			<button v-if="showSignUp" @click="signup" class="btn btn-primary">
				Registrar
			</button>
			<button v-else @click="signin" class="btn btn-primary">Entrar</button>

			<a href @click.prevent="showSignUp = !showSignUp">
				<span v-if="showSignUp">Já tem cadastro? Acesse o Login!</span>
				<span v-else>Não tem cadastro? Registre-se aqui!</span>
			</a>
		</div>
	</div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/config/global";
import axios from "axios";

export default {
	name: "Auth",
	data: function() {
		return {
			showSignUp: false,
			user: {}
		};
	},
	methods: {
		signin() {
			axios
				.post(`${baseApiUrl}/signin`, this.user)
				.then(res => {
					this.$store.commit("setUser", res.data);
					localStorage.setItem(userKey, JSON.stringify(res.data));
					this.$router.push({ path: "/" });
				})
				.catch(showError);
		},
		signup() {
			axios
				.post(`${baseApiUrl}/signup`, this.user)
				.then(res => {
					this.$toasted.global.defaultSuccess({ msg: "Usuário criado" });
					this.user = {};
					this.showSignUp = false;
				})
				.catch(showError);
		}
	}
};
</script>

<style>
.auth-content {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.auth-modal {
	background-color: #fff;
	width: 350px;
	padding: 35px;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
	display: flex;
	flex-direction: column;
	align-items: center;
}

.auth-title {
	font-size: 1.1rem;
	font-weight: 100;
	margin-top: 10px;
	margin-bottom: 15px;
}

.auth-modal button {
	align-self: flex-end;
}

.auth-modal a {
	margin-top: 35px;
}

.auth-modal hr {
	border: 0;
	width: 100%;
	height: 1px;
	background-image: linear-gradient(
		to right,
		rgba(120, 120, 120, 0),
		rgba(120, 120, 120, 0.75),
		rgba(120, 120, 120, 0)
	);
}

.auth-form {
	width: 100%;
}
</style>
