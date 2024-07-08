'use server'
import type { BuildFrameData, FrameActionPayload } from '@/lib/farcaster'
import { loadGoogleFontAllVariants } from '@/sdk/fonts'
import { FrameError } from '@/sdk/handlers'
import type { Config, State } from '..'
import { bookCall } from '../utils/cal'
import { getEventId } from '../utils/cal'
import { getCurrentAndFutureDate } from '../utils/date'
import { extractDatesAndSlots } from '../utils/date'
import PageView from '../views/AfterConfirm'
import FailView from '../views/Failed'

export default async function confirm(
    body: FrameActionPayload,
    config: Config,
    state: State,
    params: any
): Promise<BuildFrameData> {
    const roboto = await loadGoogleFontAllVariants('Roboto')
    const fonts = [...roboto]

    if (config?.fontFamily) {
        const titleFont = await loadGoogleFontAllVariants(config.fontFamily)
        fonts.push(...titleFont)
    }

    const buttonIndex = body.untrustedData.buttonIndex

    if (buttonIndex === 1) {
        //! this logic, and the `errors` function seems like they shouldn't exist anymore
        //! we removed NotSatisfied and converted it to FrameError
        //! either this or the naming is off
        return {
            buttons: [
                {
                    label: 'back',
                },
            ],
            component: FailView(config),
            functionName: 'errors',
            fonts: fonts,
        }
    }

    const dates = getCurrentAndFutureDate(30)
    const url = `https://cal.com/api/trpc/public/slots.getSchedule?input=${encodeURIComponent(
        JSON.stringify({
            json: {
                isTeamEvent: false,
                usernameList: [`${config.username}`],
                eventTypeSlug: params.duration,
                startTime: dates[0],
                endTime: dates[1],
                timeZone: 'UTC',
                duration: null,
                rescheduleUid: null,
                orgSlug: null,
            },
            meta: {
                values: {
                    duration: ['undefined'],
                    orgSlug: ['undefined'],
                },
            },
        })
    )}`

    const slots = await fetch(url)
    const slotsResponse = await slots.json()

    const [datesArray, slotsArray] = extractDatesAndSlots(slotsResponse.result.data.json.slots)
    const date = datesArray[params.date]

    const email = body.untrustedData.inputText
    const eventTypeId = await getEventId(config.username, params.duration)

    try {
        await bookCall(
            email?.split('@')[0] || '',
            email!,
            slotsResponse.result.data.json.slots[date][params.slot].time,
            eventTypeId,
            config.username
        )
    } catch (error) {
        throw new FrameError('Error booking event.')
    }

    return {
        buttons: [
            {
                label: 'Create your own',
                action: 'link',
                target: 'https://frametra.in',
            },
        ],
        fonts: fonts,
        component: PageView(config),
        functionName: 'initial',
    }
}
