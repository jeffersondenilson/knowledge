<template>
	<b-dropdown class="user-dropdown" boundary="viewport" offset="15">
		<template #button-content>
      <span class="d-none d-sm-block">
      	{{ user.name }}
      </span>
      <div>
      	<Gravatar :email="user.email" alt="User" />
      </div>
    </template>

	  <b-dropdown-item href="#">
	  	<i class="fa fa-cogs"></i> Administração
	  </b-dropdown-item>
	  <b-dropdown-item href="#">
	  	<i class="fa fa-sign-out"></i> Sair
	  </b-dropdown-item>
  </b-dropdown>
</template>

<script>
	import { mapState } from 'vuex';
	import Gravatar from 'vue-gravatar';

	export default {
		name: 'UserDropdown',
		components: { Gravatar },
		computed: mapState(['user'])
	}
</script>

<style>
	.user-dropdown {
		height: 100%;
	}

	.user-dropdown > button {
		background-color: transparent;
		display: flex;
		align-items: center;
		font-weight: 100;
		height: 100%;
		padding: 0px 20px;
		border: none;
	}

	.user-dropdown > button:hover {
		background-color: rgba(0, 0, 0, 0.2);
	}

	.user-dropdown img {
		margin: 0px 10px;
		max-height: 37px;
		border-radius: 5px;
	}
</style>