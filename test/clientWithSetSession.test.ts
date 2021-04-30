import { GoTrueClient } from '../src/index'
import faker from 'faker'

const GOTRUE_URL = 'http://localhost:9998'

const auth = new GoTrueClient({
  url: GOTRUE_URL,
  autoRefreshToken: false,
  persistSession: false,
})

const email = `client_set_session_${faker.internet.email()}`
const password = faker.internet.password()

let authWithSession = new GoTrueClient({
  url: GOTRUE_URL,
  autoRefreshToken: false,
  persistSession: false,
})

test('signUp()', async () => {
  let { error, user, session } = await auth.signUp({
    email,
    password,
  })
  expect(error).toBeNull()
  expect(session).toMatchSnapshot({
    access_token: expect.any(String),
    refresh_token: expect.any(String),
    expires_in: expect.any(Number),
    expires_at: expect.any(Number),
    user: {
      id: expect.any(String),
      email: expect.any(String),
      confirmed_at: expect.any(String),
      last_sign_in_at: expect.any(String),
      created_at: expect.any(String),
      aud: expect.any(String),
      updated_at: expect.any(String),
      app_metadata: {
        provider: 'email',
      },
    },
  })
  expect(user).toMatchSnapshot({
    id: expect.any(String),
    confirmed_at: expect.any(String),
    email: expect.any(String),
    last_sign_in_at: expect.any(String),
    created_at: expect.any(String),
    aud: expect.any(String),
    updated_at: expect.any(String),
    app_metadata: {
      provider: 'email',
    },
  })
  expect(user?.email).toBe(email)
})

test('Set session in new client', () => {
  let session = auth.session()
  expect(session).not.toBeNull()
  if (session) {
    const { error } = authWithSession.setSession(session.access_token)
    expect(error).toBeNull()
  }
})

test('Update user', async () => {
  let { error, user } = await authWithSession.update({ data: { hello: 'world' } })
  expect(error).toBeNull()
  expect(user).toMatchSnapshot({
    id: expect.any(String),
    aud: expect.any(String),
    email: expect.any(String),
    updated_at: expect.any(String),
    last_sign_in_at: expect.any(String),
    confirmed_at: expect.any(String),
    created_at: expect.any(String),
    user_metadata: {
      hello: 'world',
    },
  })
  expect(user?.email).toBe(email)
})
