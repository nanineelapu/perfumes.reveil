import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8')
        content.split('\n').forEach(line => {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith('#')) return
            const eqIdx = trimmed.indexOf('=')
            if (eqIdx > 0) {
                const key = trimmed.substring(0, eqIdx).trim()
                const value = trimmed.substring(eqIdx + 1).trim()
                process.env[key] = value
            }
        })
    }
}

async function testMC() {
    loadEnv()
    const customerId = process.env.MESSAGE_CENTRAL_CUSTOMER_ID
    const password = process.env.MESSAGE_CENTRAL_AUTH_TOKEN

    console.log('Customer ID:', customerId)
    console.log('Password set:', !!password)

    if (!customerId || !password) {
        console.error('Missing credentials')
        return
    }

    const base64Password = Buffer.from(password).toString('base64')
    console.log('Base64 Password:', base64Password)

    const url = `https://cpaas.messagecentral.com/auth/v2/token?customerId=${customerId}&country=91&email=&medium=EMAIL&password=${encodeURIComponent(base64Password)}`
    console.log('\nFetching token from URL:', url)

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        const text = await res.text()
        console.log('\nResponse Status:', res.status)
        console.log('Response Body:', text)
    } catch (e: any) {
        console.error('Fetch Error:', e.message)
    }
}

testMC()
