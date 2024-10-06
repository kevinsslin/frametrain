import type { BaseConfig, BaseStorage, BaseTemplate } from '@/lib/types'
import Inspector from './Inspector'
import cover from './cover.jpeg'
import handlers from './handlers'

type Address = `0x${string}`

export interface Config extends BaseConfig {
    background?: string
    textColor?: string
    privacy: bool
    claim: string
    owner: {
        username: string
        fid?: number
        custody_address?: Address
        pfp_url?: string
    } | null
    opponent: {
        username: string
        fid?: number
        custody_address?: Address
        pfp_url?: string
    } | null
    arbitrator: {
        username: string
        fid?: number
        custody_address?: Address
        pfp_url?: string
    } | null
    asset: Address
    amount: number
}

export interface Storage extends BaseStorage {}

export default {
    name: 'Bet',
    description: 'Bet and Win',
    shortDescription: 'Appears as composer action description (max 20 characters)',
    octicon: 'gear', // https://docs.farcaster.xyz/reference/actions/spec#valid-icons
    creatorFid: '301841',
    creatorName: 'Kevin Lin (kevinsslin)',
    cover,
    enabled: true,
    Inspector,
    handlers,
    initialConfig: {
        privacy: false,
        claim: 'I bet you that ...',
        owner: null,
        opponent: null,
        arbitrator: null,
        asset: '0x0',
        amount: 0,
    },
    events: [],
} satisfies BaseTemplate