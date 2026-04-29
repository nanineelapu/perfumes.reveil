async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/firebase-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+917661891711', id_token: 'fake', firebase_uid: 'fake', isSignup: false })
    });
    const text = await res.text();
    console.log("Firebase Sync Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.error(e);
  }
}
test();
