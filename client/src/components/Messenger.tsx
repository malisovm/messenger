import { useRef, useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { BiMailSend } from 'react-icons/bi'
import AlertMessage from './AlertMessage'
import { IMessage } from '../interfaces'
import Card from 'react-bootstrap/Card'
import useAutosizeTextArea from '../hooks/autosizeTextArea'
import Select from 'react-select'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface IProps {
  user: string
}

export function Messenger({ user }: IProps) {
  const recipientRef = useRef<HTMLInputElement | null>(null)
  const titleRef = useRef<HTMLInputElement | null>(null)
  const bodyRef = useRef<HTMLTextAreaElement | null>(null)
  const [alertMessage, setAlertMessage] = useState({
    show: false,
    text: '',
    variant: '',
  })
  const [text, setText] = useState('')
  useAutosizeTextArea(bodyRef!.current!, text)
  const [recipient, setRecipient] = useState({ value: '', label: '' })
  const [recipients, setRecipients] = useState([{}])
  const [messages, setMessages] = useState<IMessage[]>([])

  useEffect(() => {
    if (user !== '') {
    (function getData() {
      axios
        .get('/userlistandmessages', {
          headers: {
            user: user,
          },
        })
        .then((result) => {
          let usernames: {}[] = []
          result.data.userList.forEach((username: string) => {
            usernames.push({ value: username, label: username })
          })
          setRecipients(usernames)
          setMessages(result.data.userMessages)
        })
      setTimeout(getData, 5000)
    })()}
  }, [])

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    const UTCDate = new Date().toUTCString()
    const longDate = `${
      /\d{1,2}\s\D{3}\s\d{4}\s\d{1,2}:\d{1,2}:\d{1,2}/.exec(UTCDate)![0]
    } (UTC)`
    let message: IMessage = {
      sender: user,
      recipient: recipient.value,
      title: titleRef!.current!.value,
      body: bodyRef!.current!.value,
      date: longDate,
    }
    axios
      .post('/messages', message)
      .then(() => {
        setAlertMessage({
          show: true,
          text: 'Message sent!',
          variant: 'success',
        })
      })
      .catch((err) => {
        setAlertMessage({
          show: true,
          text: err,
          variant: 'danger',
        })
      })
  }

  const handleTextChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value
    setText(val)
  }

  return (
    <Container>
      <Row xs={1} md={2} lg={2} className="mt-5">
        <Col style={{ width: '500px' }}>
          <Form
            className="square border border-primary rounded p-2 mb-3"
            onSubmit={handleSubmit}
          >
            <h5 className="mb-3">Send a message</h5>
            <Form.Group className="mb-3" controlId="formRecipient">
              <Form.Label>Write to:</Form.Label>
              <Select
                /*@ts-ignore*/
                ref={recipientRef}
                options={recipients}
                required
                placeholder="Enter recipient"
                autoComplete="off"
                /*@ts-ignore*/
                onChange={(input) => setRecipient(input)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title:</Form.Label>
              <Form.Control
                ref={titleRef}
                required
                autoComplete="off"
                placeholder="Enter title"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBody">
              <Form.Label>Message:</Form.Label>
              <Form.Control
                ref={bodyRef}
                as="textarea"
                style={{ overflow: 'hidden' }}
                onChange={handleTextChange}
                //@ts-ignore
                rows="1"
                required
                placeholder="Enter message"
              />
            </Form.Group>
            <Button className="mb-2" variant="primary" type="submit">
              <BiMailSend /> Submit
            </Button>
          </Form>
          <Link to="/">Log in as a different user</Link>
          {alertMessage.show && (
            <AlertMessage
              variant={alertMessage.variant}
              text={alertMessage.text}
              setMessage={setAlertMessage}
            />
          )}
        </Col>
        <Col style={{ width: '500px' }}>
          <h4 className="mb-4">Your messages:</h4>
          {messages &&
            messages.map((message: IMessage) => (
              <Card key={message._id} bg="light" className="mb-4">
                <Card.Header as="h5">{message.title}</Card.Header>
                <Card.Body>
                  <Card.Subtitle className="text-end fst-italic fw-light">
                    From: {message.sender}
                  </Card.Subtitle>
                  <Card.Text className="mt-3">{message.body}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">{message.date}</small>
                </Card.Footer>
              </Card>
            ))}
        </Col>
      </Row>
    </Container>
  )
}
