const Divider = ({ type = 'horizontal', light = false }) => {
  return type === 'horizontal' ? (
    <div
      className="w-auto my-3"
      style={{
        height: 1,
        borderTop: '1px solid ' + (light ? '#d1d7dc' : '#3e4143'),
      }}
    />
  ) : (
    <div
      className="h-auto mx-3"
      style={{
        width: 1,
        borderLeft: '1px solid ' + (light ? '#d1d7dc' : '#3e4143'),
      }}
    />
  )
}

export default Divider
