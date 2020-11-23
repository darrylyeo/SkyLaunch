<script lang="ts">
	import { scale } from 'svelte/transition'

	export let iconAnimation: 'spin' | 'hover' = 'hover'
</script>

<style>
	.loading {
		animation: Hover 1.5s infinite;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--padding-inner);

		--hover-intensity: 4px;
	}
	.icon {
		display: inline-flex;
		place-items: center;
		font-size: 1.5em;
	}
	.spin {
		animation: Spin 1s linear infinite;
	}
	.hover {
		animation: Hover 1s linear infinite;
		--hover-intensity: 100px;
	}

	@keyframes Spin {
		from { transform: rotate(0); }
		to { transform: rotate(360deg); }
	}

	@keyframes Hover {
		from, to { transform: perspective(1000px) translateZ(calc(-1 * var(--hover-intensity))); }
		50% { transform: perspective(1000px) translateZ(var(--hover-intensity)); }
	}
</style>

<div class="loading card" transition:scale>
	<span class="icon {iconAnimation}">
		<slot name="icon">
			<img src="Skynet Logo.svg" height="30">
		</slot>
	</span>
	<slot></slot>
</div>