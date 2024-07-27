'use server'
import type { BuildFrameData, FrameButtonMetadata } from '@/lib/farcaster'
import { loadGoogleFontAllVariants } from '@/sdk/fonts'
import type { Config } from '..'
import CoverView from '../views/Cover'
import { formatSymbol } from '../utils/shared'

export default async function initial({
    config,
}: {
    // GET requests don't have a body.
    body: undefined
    config: Config
    storage: undefined
}): Promise<BuildFrameData> {
    const buttons: FrameButtonMetadata[] = []
    const roboto = await loadGoogleFontAllVariants('Roboto')
    console.log({ config })

    if (config.token?.symbol && config.enablePredefinedAmounts && config.amounts.length) {
        for (const amount of config.amounts) {
            buttons.push({
                label: formatSymbol(amount, config.token.symbol),
            })
        }

        buttons.push({
            label: 'Custom',
        })
    } else {
        buttons.push({
            label: 'Donate',
        })
    }

    return {
        inputText: config.token?.symbol
            ? `Donate custom ${config.token?.symbol} amount`
            : undefined,
        buttons: buttons.map((button) => ({
            ...button,
            action: 'tx',
            target: '/transaction',
        })),
        fonts: roboto,
        component: CoverView(config),
        handler: 'status',
    }
}
