interface Env {
    FORM_ENDPOINT: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const formData = await context.request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        const honeypot = formData.get('hpot'); // Anti-spam honeypot

        // 1. Basic Spam Protection (Honeypot)
        if (honeypot) {
            return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 2. Validation
        if (!name || !email || !message) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 3. Prepare data for relay
        // The FORM_ENDPOINT should be set in Cloudflare Pages environment variables
        // Preferred relay: Formspree, Getform, or a custom internal endpoint
        const endpoint = context.env.FORM_ENDPOINT as string;

        if (!endpoint) {
            console.error('FORM_ENDPOINT is not configured');
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 4. Relay the request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                subject: subject || 'New Contact from ConvertFiles',
                message,
                _source: 'ConvertFiles Contact Form'
            }),
        });

        if (response.ok) {
            return new Response(JSON.stringify({ success: true, message: 'Message sent successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            const errorData = await response.json();
            return new Response(JSON.stringify({ error: 'Failed to send message', details: errorData }), {
                status: 502,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error('Contact API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
