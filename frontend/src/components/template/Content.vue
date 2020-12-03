<template>
	<main class="content">
		<router-view></router-view>
	</main>
</template>

<script>
	export default {
		name: 'Content'
	}
</script>

<style>
	.content {
		grid-area: content;
		background-color: #efefef;
		padding: 20px;
	}
</style>