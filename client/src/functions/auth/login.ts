
// this is the redirect uri with error in the name
// TODO: deal with error before the redirect uri

// this whole chain is kinda iffy

export async function logIn(canvasToken: string) { // this is really silly.....
  authenticateCanvas(canvasToken);
  window.location.href = '/api/classroom/login'; 
}

// TODO: make them seperate?
export async function getIsLoggedIn() {
  const data = await Promise.all([
    fetch('/api/canvas/auth'),
    fetch('/api/classroom/auth'),
  ]).then((res) => Promise.all(res.map((r) => r.json()))); // necessary?
  return data[0] && data[1];
}

export async function authenticateCanvas(token: string) {
  fetch('/api/canvas/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token }),
  });
}
