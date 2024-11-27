import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('/users/register', 'AuthController.register')
Route.post('/users/login', 'AuthController.login')

Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.get('/users/:id', 'UsersController.show')
  Route.put('/users/:id', 'UsersController.update')
  Route.delete('/users/:id', 'UsersController.destroy')
}).middleware('auth')

Route.get('/github/redirect', async ({ ally }) => {
  return ally.use('github').redirect()
})
