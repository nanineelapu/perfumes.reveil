import * as admin from 'firebase-admin'

// Singleton: initialize Firebase Admin only once across all route handlers
if (!admin.apps.length) {
    try {
        const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        const clientEmail = process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL
        // Vercel stores the key with literal \n — replace them with real newlines
        const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n')

        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
            })
        } else {
            // Dev-only fallback (token verification will not work without Service Account)
            admin.initializeApp({ projectId })
            console.warn('[firebase-admin] Initialized without Service Account — token verification will fail in production.')
        }
    } catch (error) {
        console.error('[firebase-admin] Initialization error:', error)
    }
}

export { admin }
