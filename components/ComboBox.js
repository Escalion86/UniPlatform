import cn from 'classnames'

const ComboBox = ({
  name,
  title,
  defaultValue = '',
  onChange,
  placeholder,
  items,
  inLine = false,
  disabled = false,
}) => {
  const defaultItem = items.find((item) => item.value === defaultValue)
  const defaultValueExists = !!defaultItem

  return (
    <div
      className={cn('flex', inLine ? 'flex-row items-center ' : 'flex-col ')}
    >
      <label
        className={cn({ 'min-w-24 max-w-40 w-1/4': inLine })}
        htmlFor={name}
      >
        {title}
      </label>
      <select
        name={name}
        className={cn(
          'px-1 rounded-sm border',
          disabled ? 'bg-gray-200 outline-none' : 'bg-white border-gray-600'
        )}
        onChange={(e) => !disabled && onChange && onChange(e.target.value)}
        defaultValue={defaultValueExists ? defaultValue : ''}
      >
        {placeholder && (
          <option disabled value="">
            {placeholder}
          </option>
        )}
        {items.map((item, index) => (
          <option key={'combo' + index} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ComboBox
