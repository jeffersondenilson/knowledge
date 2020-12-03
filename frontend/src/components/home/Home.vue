<template>
	<div class="home">
		<PageTitle 
			icon="fa fa-home" 
			title="Dashboard" 
			subtitle="Base de Conhecimento"
		/>
	</div>
</template>

<script>
	import PageTitle from '../template/PageTitle';

	export default {
		name: 'Home',
		components: { PageTitle }
	}
</script>