import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error occured', {
            status: 400
        })
    }

    // Handle user creation
    if (evt.type === 'user.created') {
        const { id, username } = evt.data
        const supabase = createAdminClient()

        // Default username fallback if they didn't set one yet
        const finalUsername = username || `user_${id.slice(-8)}`

        const { error } = await supabase.from('users').insert({
            clerk_id: id,
            username: finalUsername,
            clout_score: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            no_shows: 0,
            battle_count: 0
        })

        if (error) {
            console.error('Error creating user in Supabase:', error)
            return new Response('Error creating user', { status: 500 })
        }
    }

    return new Response('', { status: 200 })
}
