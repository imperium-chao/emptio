
import NDK, { NDKUserProfile, NDKPrivateKeySigner, NDKEvent } from "@nostr-dev-kit/ndk"
import { Filter, Event } from "nostr-tools"
import { HexPairKeys } from "../memory/types"
import { getRelays } from "./relays"
import { NostrEventKinds } from "@/src/constants/Events"

export const getNostrInstance = async (): Promise<NDK> => {

    const relays = await getRelays()

    const ndk = new NDK({ explicitRelayUrls: relays })

    await ndk.connect()
    
    return ndk
}

export const publishUser = async (profile: NDKUserProfile, keys: HexPairKeys) => {
       
    Nostr.signer = new NDKPrivateKeySigner(keys.privateKey)

    const user = Nostr.getUser({ hexpubkey: keys.publicKey })

    await user.fetchProfile()

    user.profile = profile

    await user.publish()
}

export const publishEvent = async (event: { kind: number, content: string }, keys: HexPairKeys) => {

    Nostr.signer = new NDKPrivateKeySigner(keys.privateKey)

    const eventSend = new NDKEvent(Nostr);

    eventSend.content = event.content
    
    eventSend.kind = event.kind 

    await eventSend.sign()  
    
    await eventSend.publish()
}

export const listenerEvents = async (filters: Filter) => {

    const events = await Nostr.fetchEvents(filters)

    const eventsResut: {
        id: string,
        kind: number,
        pubkey: string,
        content: any,
        created_at: number,
        tags: string[][] 
    }[] = []

    events.forEach((event: Event) => {

        let jsonContent = [NostrEventKinds.metadata].includes(event.kind)

        eventsResut.push({
            id: event.id,
            kind: event.kind,
            pubkey: event.pubkey,
            content: jsonContent ? JSON.parse(event.content) : event.content,
            created_at: event.created_at,
            tags: event.tags
        })
    })

    return eventsResut
}

export const getEvent = async (filters: Filter) => {

    const event = await Nostr.fetchEvent(filters)

    const eventsResut: {
        kind: number,
        pubkey: string,
        content: string
    } = {
        kind: event?.kind ? event?.kind : 0,
        pubkey: event?.pubkey ? event?.pubkey : "",
        content: event?.content ? event?.content : ""
    }

    return eventsResut
}

