import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async register({ request, response }: HttpContext) {
    const { email, password, fullName } = request.only(['email', 'password', 'fullName'])
    const hashedPassword = await hash.make(password)

    const user = await User.create({ email, password: hashedPassword, fullName })
    return response.created(user)
  }

  public async login({ request, auth, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const token = await auth.check('api').attempt(email, password)
      return response.ok({ message: 'Login successful', token })
    } catch {
      return response.unauthorized({ message: 'Invalid credentials' })
    }
  }

  public async index({ response }: HttpContext) {
    const users = await User.all()
    return response.ok(users)
  }

  public async show({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }
    return response.ok(user)
  }

  public async update({ params, request, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    const data = request.only(['email', 'name'])
    user.merge(data)
    await user.save()

    return response.ok(user)
  }

  public async destroy({ params, response }: HttpContext) {
    const user = await User.find(params.id)
    if (!user) {
      return response.notFound({ message: 'User not found' })
    }

    await user.delete()
    return response.noContent()
  }
}
