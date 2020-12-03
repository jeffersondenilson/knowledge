<template>
	<main class="content">
		<PageTitle 
			icon="fa fa-cogs" 
			title="Pagina" 
			subtitle="Wub"
		/>
	</main>
</template>

<script>
	import PageTitle from './PageTitle';

	export default {
		name: 'Content',
		components: { PageTitle }
	}
</script>

<style>
	.content {
		grid-area: content;
		background-color: #efefef;
		padding: 20px;
	}
</style>