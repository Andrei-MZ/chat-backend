import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  async register({ auth, request, response }: HttpContextContract) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const user = await User.create({ email, password })

      const token = await auth.use('api').attempt(email, password)

      return {
        user,
        token,
      }
    } catch (error) {
      return response.badRequest({ error: 'Não foi possível completar o registro.' })
    }
  }

  async login({ auth, request, response }: HttpContextContract) {
    try {
      const { email, password } = request.only(['email', 'password'])

      const token = await auth.use('api').attempt(email, password)

      return {
        message: 'Login realizado com sucesso.',
        token,
      }
    } catch (error) {
      return response.unauthorized({ error: 'Credenciais inválidas.' })
    }
  }
}
