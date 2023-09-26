/* eslint-disable @typescript-eslint/no-explicit-any */
import supertest from 'supertest'
import {createServer} from '..'
import type {UserService} from '../controllers/user'
import {cloneDeep} from 'lodash'

const createRegisterUserReq = (overrides: any = {}) => {
  return cloneDeep({
    name: 'user',
    email: 'user@email.com',
    password: '123123123',
    business: {
      name: 'Business name',
      cnpj: '36.321.081/0001-79',
    },
    ...overrides,
  })
}

const createLoginUserReq = (overrides: any = {}) => {
  return cloneDeep({
    email: 'usuario@email.com',
    password: '123123123',
    ...overrides,
  })
}

const createUpdateUserReq = (overrides: any = {}) => {
  return cloneDeep({
    name: 'user',
    email: 'usuario@email.com',
    ...overrides,
  })
}

const createMockedRegisterUser = (userReturnedData?: any): UserService => {
  const mockedUserService: jest.Mocked<UserService> = {
    registerUser: jest.fn().mockResolvedValue(userReturnedData),
    loginUser: jest.fn(),
    updateUser: jest.fn(),
  }

  return mockedUserService
}

const createMockedLoginUser = (userReturnedData?: any): UserService => {
  const mockedUserService: jest.Mocked<UserService> = {
    registerUser: jest.fn(),
    loginUser: jest.fn().mockResolvedValue(userReturnedData),
    updateUser: jest.fn(),
  }

  return mockedUserService
}

const createMockedUpdateUser = (userReturnedData?: any): UserService => {
  const mockedUserService: jest.Mocked<UserService> = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    updateUser: jest.fn().mockResolvedValue(userReturnedData),
  }

  return mockedUserService
}

describe('POST /users/new', () => {
  it('should respond successfully with data returned in service', async () => {
    const requestData = createRegisterUserReq()
    const {name, email} = requestData
    const mockedSafeUser = {name, email}
    const mockedUserService = createMockedRegisterUser(mockedSafeUser)
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .post('/users/new')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(mockedUserService.registerUser).toHaveBeenCalledTimes(1)
    expect(res.body).toEqual({success: true, data: mockedSafeUser})
  })

  it('should respond unsuccessfully when a field data type is invalid', async () => {
    const requestData = createRegisterUserReq({name: 1})
    const mockedUserService = createMockedRegisterUser()
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .post('/users/new')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
    expect(mockedUserService.registerUser).not.toHaveBeenCalled()
    expect(res.body).toMatchObject({success: false})
  })

  it('should respond unsuccessfully when a required field is not present', async () => {
    const requestData = createRegisterUserReq({email: undefined})
    const mockedUserService = createMockedRegisterUser()
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .post('/users/new')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
    expect(mockedUserService.registerUser).not.toHaveBeenCalled()
    expect(res.body).toMatchObject({success: false})
  })

  it('should respond unsuccessfully when business cnpj is invalid', async () => {
    const invalidCnpj = '36.321.081/0001-71'
    const requestData = createRegisterUserReq({
      business: {cnpj: invalidCnpj},
    })
    const mockedUserService = createMockedRegisterUser()
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .post('/users/new')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
    expect(mockedUserService.registerUser).not.toHaveBeenCalled()
    expect(res.body).toMatchObject({success: false})
  })
})

describe('POST /users/login', () => {
  it('should respond successfully with data returned in service', async () => {
    const requestData = createLoginUserReq()
    const {email} = requestData
    const mockedSafeUser = {name: 'user', email, token: 'generated_token'}
    const mockedUserService = createMockedLoginUser(mockedSafeUser)
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .post('/users/login')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(mockedUserService.loginUser).toHaveBeenCalledTimes(1)
    expect(res.body).toEqual({success: true, data: mockedSafeUser})
  })

  it('should respond unsuccessfully when a field data type is invalid', async () => {
    const requestData = createLoginUserReq({password: 1})
    const mockedUserService = createMockedLoginUser()
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .post('/users/login')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
    expect(mockedUserService.loginUser).not.toHaveBeenCalled()
    expect(res.body).toMatchObject({success: false})
  })

  it('should respond unsuccessfully when a required field is not present', async () => {
    const requestData = createLoginUserReq({password: undefined})
    const mockedUserService = createMockedLoginUser()
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .post('/users/login')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
    expect(mockedUserService.loginUser).not.toHaveBeenCalled()
    expect(res.body).toMatchObject({success: false})
  })

  it('should respond unsuccessfully when email is invalid', async () => {
    const invalidEmail = 'user@email'
    const requestData = createLoginUserReq({email: invalidEmail})
    const mockedUserService = createMockedLoginUser()
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .post('/users/login')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
    expect(mockedUserService.loginUser).not.toHaveBeenCalled()
    expect(res.body).toMatchObject({success: false})
  })
})

describe('PUT /users/:id', () => {
  it('should respond successfully with data returned in service', async () => {
    const requestData = createUpdateUserReq()
    const {name, email} = requestData
    const mockedSafeUser = {name, email}
    const mockedUserService = createMockedUpdateUser(mockedSafeUser)
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .put('/users/1')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(200)
    expect(mockedUserService.updateUser).toHaveBeenCalledTimes(1)
    expect(res.body).toEqual({success: true, data: mockedSafeUser})
  })

  it('should respond unsuccessfully when a field data type is invalid', async () => {
    const requestData = createUpdateUserReq({email: 1})
    const mockedUserService = createMockedUpdateUser()
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .put('/users/1')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
    expect(mockedUserService.updateUser).not.toHaveBeenCalled()
    expect(res.body).toMatchObject({success: false})
  })

  it('should respond unsuccessfully when email is invalid', async () => {
    const invalidEmail = 'user@email'
    const requestData = createUpdateUserReq({email: invalidEmail})
    const mockedUserService = createMockedUpdateUser()
    const server = createServer({userService: mockedUserService})
    const request = supertest(server.app.callback())
    const res = await request
      .put('/users/1')
      .send(requestData)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
    expect(res.status).toBe(400)
    expect(mockedUserService.updateUser).not.toHaveBeenCalled()
    expect(res.body).toMatchObject({success: false})
  })
})
