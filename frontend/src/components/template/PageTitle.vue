<template>
	<div class="page-title">
		<h1>
			<i v-if="icon" :class="icon"></i> {{ title }}
		</h1>
		<h2>{{ subtitle }}</h2>
		<hr>
	</div>
</template>

<script>
	export default {
		name: 'PageTitle',
		props: ['icon', 'title', 'subtitle']
	}
</script>

<style>
	.page-title h1 {
		margin: 0px;
		font-size: 2rem;
	}

	.page-title h2 {
		color: #777;
		margin-top: 5px;
		font-size: 1.3rem;
	}
</style>