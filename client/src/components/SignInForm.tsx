import { useRef } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Container from './Container'

interface IProps {
  setUser: (user: string) => void
}

export default function SignInForm({ setUser }: IProps) {
  const nameRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    let user = nameRef!.current!.value
    setUser(user)
    if (user) {
      axios
        .post('/login', { _id: user })
        .catch((err) => console.log(err))
      navigate('/messenger')
    }
  }

  return (
    <Container>
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Control
          required
          placeholder="Enter username"
          autoComplete="off"
          ref={nameRef}
        />
      </Form.Group>

      <Button className="mb-3" variant="primary" type="submit">
        Submit
      </Button>
      <br />
    </Form>
    </Container>
  )
}
