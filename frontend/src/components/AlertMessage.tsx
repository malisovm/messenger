import { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'

interface IProps {
  variant: string
  text: string
  setMessage: (message: {
    variant: string
    text: string
    show: boolean
  }) => void
}

export default function AlertMessage({ variant, text, setMessage }: IProps) {
  const [showAlert, setShowAlert] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false)
      setMessage({ show: false, variant: '', text: '' })
    }, 1500)
  }, [setMessage])

  return (
    <Alert variant={variant} show={showAlert}>
      {text}
    </Alert>
  )
}
