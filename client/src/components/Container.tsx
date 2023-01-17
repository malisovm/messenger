export default function Container({ children }: React.PropsWithChildren) {
  return (
    <div
      className="d-flex flex-column justify-content-md-center align-items-center vh-100"
      style={{ marginTop: '-100px' }}
    >
      {children}
    </div>
  )
}
