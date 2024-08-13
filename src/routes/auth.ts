import { Router, Request, Response } from 'express'
import User from '../db/models/user'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).send({
      code: 404,
      success: false,
      message: 'User not found',
    })
  }

  const isPasswordValid = await user.comparePassword(password)

  if (!isPasswordValid) {
    return res.status(401).send({
      code: 401,
      success: false,
      message: 'Invalid password',
    })
  }


  res.status(200).send({
    code: 200,
    success: true,
    message: 'Login successful',
  })
})

export default router