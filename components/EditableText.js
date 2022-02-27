import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBan,
  faBold,
  faFont,
  faHeading,
  faItalic,
  faPencilAlt,
  faStrikethrough,
  faSubscript,
  faSuperscript,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MODES } from '@helpers/constants'
import cn from 'classnames'
import { EditText } from 'react-edit-text'

const EditableText = ({
  className,
  value,
  mode,
  onChange,
  onSave,
  readonly = true,
  textClass,
  style,
  inline,
}) => {
  return (
    <div className={cn('w-full flex', className)}>
      {readonly ? (
        <div className={'flex-1 px-1 py-0.5 m-0'}>{value}</div>
      ) : (
        <EditText
          style={{ minHeight: 28, ...style }}
          inline={inline}
          className={cn(
            'flex-1 px-1 py-0 m-0 whitespace-normal border-b outline-none items-center',
            mode === MODES.ADMIN
              ? 'border-purple-600 bg-white'
              : 'border-transparent',
            textClass
          )}
          value={value}
          // inline
          onChange={(newValue) => {
            onChange(newValue)
          }}
          onSave={({ newValue }) => onSave(newValue)}
        />
      )}
    </div>
  )
}

export default EditableText
