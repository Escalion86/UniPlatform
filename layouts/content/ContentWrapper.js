const ContentWrapper = ({ children }) => {
  return (
    <div
      className="flex flex-col w-full overflow-scroll overflow-x-hidden"
      style={{ gridArea: 'content' }}
    >
      {children}
    </div>
  )
}

export default ContentWrapper
