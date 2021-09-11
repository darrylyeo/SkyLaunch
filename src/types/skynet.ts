export type SkynetApp = {
	category: string
	createdAt: Date
	description: string
	fileformat: string
	filename: string
	git_url: string
	id: string
	searchable: string
	skylink: string
	title: string
	type: string
	updatedAt: Date
}

export type SkynetAppCategory = 'video' | 'audio' | 'blog' | 'games' | 'books' | 'pictures' | 'skynetportal' | 'utilities' | 'other'

export const skynetAppCategories: SkynetAppCategory[] = ['video', 'audio', 'blog', 'games', 'books', 'pictures', 'skynetportal', 'utilities', 'other']


export type SkynetWebPortal = string

export const knownSkynetWebPortals: SkynetWebPortal[] = [
	'siasky.net',
	'skyportal.xyz',
	'skynethub.io',
	'skydrain.net',
	'sialoop.net',
	'skynet.luxor.tech',
	'skynet.tutemwesi.com',
	'siacdn.com',
	'vault.lightspeedhosting.com',
	'skynet.utxo.no',
]