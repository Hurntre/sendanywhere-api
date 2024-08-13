import User from '../models/user'

const devAdminSeeder = async () => {
  const user = await User.findOne({ email: 'john.doe@example.com' })
  if (!user) {
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      password: 'password',
      isAdmin: true,
    })
  }
}

export default devAdminSeeder