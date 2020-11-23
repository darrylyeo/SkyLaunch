<script lang="ts">
	// import fetch from 'node-fetch'
	import { onMount } from 'svelte'

	import type { SkynetApp, SkynetAppCategory, SkynetWebPortal } from './definitions/skynet'
	import { skynetAppCategories, knownSkynetWebPortals } from './definitions/skynet'


	const getApps = async () => {
		let { result: apps } = await globalThis.fetch(`https://skynethub-api.herokuapp.com/skapps?limit=500`)
			.then(response => response.json())
		
		// Hide if "Marked Deleted by Skynethub"
		apps = apps.filter(app =>
			(!app.description || !app.description.includes('Marked Deleted by Skynethub'))
		)
		
		return apps as SkynetApp[]
	}

	let apps: SkynetApp[]
	let visibleApps: SkynetApp[]

	let getAppsPromise
	onMount(() => {
		getAppsPromise = getApps()
			.then(_apps => apps = _apps)
	})
	// $: console.log(apps, visibleApps)


	let searchQuery = ''
	let categoryFilter: SkynetAppCategory | 'all' = 'all'

	// $: visibleApps = apps?.filter(app => {
	// 	const query = searchQuery.trim()

	// 	return Boolean(
	// 		// Search query
	// 		(query.length > 3 || app.title.includes(query) || app.description.includes(query)) &&

	// 		// Category filter
	// 		(categoryFilter === 'all' || app.category === categoryFilter)
	// 	)
	// })
	$: if(apps){
		const query = searchQuery.trim().toLowerCase()

		if(query || categoryFilter !== 'all')
			visibleApps = apps.filter(app => Boolean(
				// Search query
				(!query || app.title.toLowerCase().includes(query) || app.description.toLowerCase().includes(query)) &&

				// Category filter
				(categoryFilter === 'all' || app.category === categoryFilter)
			))
		else
			visibleApps = apps
	}


	const isSkynetWebPortalLink = url => {
		try {
			const domain = new URL(url)?.hostname
			return knownSkynetWebPortals.some(portalDomain => portalDomain === domain || portalDomain.endsWith(`.hns.${domain}`))
		}catch(e){
			console.error(e)
			return false
		}
	}

	let preferredSkynetPortal: SkynetWebPortal | 'none' = 'none'
	const overrideSkynetPortal = (url, preferredSkynetPortal) => {
		for(const portalDomain of knownSkynetWebPortals)
			url = url.replace(portalDomain, preferredSkynetPortal)
		return url
	}


	const titleCase = string =>
		string[0].toUpperCase() + string.slice(1)
	

	import Loading from './Loading.svelte'

	import { fly, scale } from 'svelte/transition'
	import { flip } from 'svelte/animate'
</script>

<style>
	header {
		grid-area: header;
		display: grid;
		gap: 1.5rem;
		text-align: center;

		padding: 2rem;
	}

	main {
		grid-area: main;
		display: grid;
		align-content: start;
		gap: var(--padding-inner);
	}

	footer {
		grid-area: footer;
		position: sticky;
		width: 100%;
		bottom: var(--padding-outer);
		margin-bottom: var(--padding-outer);
		z-index: 1;

		background-color: rgb(230 230 230 / 50%);

		-webkit-backdrop-filter: var(--overlay-backdrop-filter);
		backdrop-filter: var(--overlay-backdrop-filter);
		--padding-outer: 1em;
		padding: var(--padding-outer);
	}

	h1 {
		font-size: 3em;
		font-weight: 700;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}

	img {
		vertical-align: middle;
	}


	.row {
		display: flex;
		gap: var(--padding-inner);
		--padding-inner: 1.5rem;
		justify-content: space-between;
		align-items: center;
	}


	.apps-toolbar {
		position: sticky;
		width: 100%;
		top: var(--padding-outer);
		z-index: 1;

		-webkit-backdrop-filter: var(--overlay-backdrop-filter);
		backdrop-filter: var(--overlay-backdrop-filter);
		padding: var(--padding-outer);

		/* background: linear-gradient(60deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.6)) var(--primary-color); */
		background: var(--skynet-green-light-translucent);
	}

	.search-field {
		flex: 1;
	}


	.apps-wrapper {
		display: grid;
		gap: var(--padding-inner);
		grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
		padding: calc(var(--padding-outer) / 2) var(--padding-outer);
	}

	.app {
		grid-template-rows: auto 1fr;
		border-bottom-right-radius: 0;
		/* --border-radius: 1rem;
		border-radius: var(--border-radius) var(--border-radius) 0 var(--border-radius); */
		/* border: var(--primary-color) 3px solid; */
	}

	.description {
		font-size: 0.85em;
	}
	/* .app:not(:hover):not(:focus):not(:focus-within) .description { */
	.app:not(:focus):not(:focus-within) .description:not(:active) {
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;  
		overflow: hidden;
	}

	.links {
		display: flex;
		justify-content: flex-end;
		flex-wrap: wrap;
		gap: var(--padding-inner);
		--padding-inner: 0.5ch;
		font-size: 0.9em;
	}

	.faded {
		opacity: 0.62;
	}

	.clouds {
		grid-area: header;
		position: sticky;
		top: 0;
		filter: contrast(.6) sepia(1) hue-rotate(55deg);
		opacity: 0.33;
		width: 0;
		justify-self: center;
		z-index: -1;
	}
	.cloud {
		position: absolute;
		font-size: calc(var(--size, 0.5) * 1em);
		animation: Cloud calc(var(--duration, 30) * 1s) calc(var(--delay, 10) * 1s) infinite;
		top: calc(var(--y) * 1%);
	}

	@keyframes Cloud {
		from { transform: translateX(-60vw); }
		to { transform: translateX(60vw); }
	}
</style>

<header in:fly={{x: 300}} out:fly={{x: -300}}>
	<h1 class="logo"><color>Sky</color>Store</h1>
	<h2>your gateway to the best dApps on <a href="https://siasky.net"><img src="Skynet Logo.svg" height="40"> <img alt="Skynet" src="Skynet Wordmark.svg" height="30"></a></h2>
</header>

<main id="apps">
	{#await getAppsPromise}
		<Loading>
			Searching for apps in the stratosphere...
		</Loading>
	{:then}
		{#if visibleApps}
			<div class="apps-toolbar card row">
				<h2 class="count">{visibleApps.length} dApp{visibleApps.length !== 1 ? 's' : ''} found</h2>

				<input class="search-field" type="search" placeholder="Search dApps..." bind:value={searchQuery} />

				<label>
					<strong>Filter by Category:</strong>
					<select bind:value={categoryFilter}>
						<option value="all">all</option>
						{#each skynetAppCategories as appCategory}
							<option value={appCategory}>{appCategory}</option>
						{/each}
					</select>
				</label>

				<!-- <span>{visibleApps.length} dApps found</span> -->
			</div>
			<div class="apps-wrapper">
				{#each visibleApps as app, i (app.id)}
					<article class="app card" tabindex=0><!-- in:scale={{delay: i * 5}} out:scale animate:flip={{duration: 200, delay: i * 5}} -->
						<div class="bar">
							<h3><a href={preferredSkynetPortal !== 'none' ? overrideSkynetPortal(app.skylink, preferredSkynetPortal) : app.skylink}>{app.title}</a></h3>
							<span class="category card-annotation">{app.category}</span>
						</div>
						{#if app.description}
							<p class="description">{app.description}</p>
						{/if}
						<hr>
						<div class="links">
							{#if app.git_url}
								<!-- <button> -->
									<a href={app.git_url}>Source Code</a>
								<!-- </button> -->
							{/if}
							{#if app.git_url && app.skylink}•{/if}
							{#if app.skylink}
								<!-- <button> -->
									<!-- <strong><a href={isSkynetWebPortalLink(app.skylink) && preferredSkynetPortal ? overrideSkynetPortal(app.skylink, preferredSkynetPortal) : app.skylink}>Visit {isSkynetWebPortalLink(app.skylink) ? 'on Skynet' : 'Website'}</a></strong> -->
									{#if isSkynetWebPortalLink(app.skylink)}
										<strong><a href={preferredSkynetPortal !== 'none' ? overrideSkynetPortal(app.skylink, preferredSkynetPortal) : app.skylink}>Visit on {preferredSkynetPortal !== 'none' ? preferredSkynetPortal : 'Skynet'}</a></strong>
									{:else}
										<strong><a href={app.skylink}>Visit Website</a></strong>
									{/if}
								<!-- </button> -->
							{/if}
						</div>
					</article>
				{:else}
					<div class="card">
						{#if searchQuery}
							There aren't any{categoryFilter !== 'all' ? ` "${categoryFilter}"` : ''} dApps matching "{searchQuery}".
						{:else}
							There aren't any dApps available yet!
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/await}
</main>

<footer class="card">
	<div class="row">
		<div>
			<small><span class="faded">Powered by</span> <a href="https://siasky.net"><img src="Skynet Logo.svg" height="20"> <img alt="Skynet" src="Skynet Wordmark.svg" height="18"></a></small>
		</div>
		<label>
			<strong>Preferred Skynet Portal: </strong>
			<select bind:value={preferredSkynetPortal}>
				<option value="none">None (no override)</option>
				{#each knownSkynetWebPortals as portalDomain}
					<option>{portalDomain}</option>
				{/each}
			</select>
		</label>
		<!-- <p>Source: <a href="https://github.com/skynethubio/SkyAppStore">SkyAppStore by Skynethub.io</a></p> -->
		<div>
			<small><span class="faded">SkyStore v0.0.1</span> • <strong><a href="https://github.com/darrylyeo/SkyStore">GitHub</a></strong></small>
		</div>
	</div>
</footer>

<div class="clouds">
	{#each [...Array(20)] as _}
		<span class="cloud" style="--size: {1 + Math.random() * 4}; --duration: {50 + Math.random() * 100}; --delay: {Math.random() * -150}; --y: {Math.random() * 100}">☁️</span>
	{/each}
</div>