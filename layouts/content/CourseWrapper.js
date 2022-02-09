const CourseWrapper = ({ children }) => {
  return (
    <div
      className="grid w-full h-screen overflow-hidden"
      style={{
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: 'auto 1fr',
        gridTemplateAreas: `
          'header header'
          'sidebar content'
          'loading loading'
        `,
      }}
    >
      {children}
    </div>
  )
}

export default CourseWrapper
