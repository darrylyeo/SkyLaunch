<script lang="ts">
	export let segment: string
</script>

<style>
	:global(#sapper) {
		display: grid;
		grid:
			"header" auto
			"main" 1fr
			"footer" auto;
		justify-content: center;
		min-height: 100vh;
		gap: 1rem;
	}

	:global(#sapper > *) {
		max-width: var(--one-column-width)
	}
</style>

<slot></slot>
