const ContentWrapper = ({ children }) => {
  return (
    <div
      className="flex flex-col w-full overflow-scroll"
      style={{ gridArea: 'content' }}
    >
      {children}
    </div>
  )
}

export default ContentWrapper
