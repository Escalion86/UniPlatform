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
import ContentEditable from 'react-contenteditable'

const Button = ({ icon, cmd, arg, iconClassName }) => (
  <button
    className="flex items-center justify-center w-8 h-8 p-1.5 text-black duration-200 border border-gray-400 rounded max-h-8 max-w-8 hover:text-general"
    onMouseDown={(evt) => {
      evt.preventDefault() // Avoids loosing focus from the editable area
      document.execCommand(cmd, false, arg) // Send the command to the browser
    }}
  >
    <FontAwesomeIcon icon={icon} className={iconClassName ?? 'w-5 h-5'} />
  </button>
)

const GroupButtons = ({ name, children }) => (
  <div className="flex flex-col p-1 border border-gray-300 rounded gap-y-1">
    <div className="flex justify-center">{name}</div>
    <div className="flex gap-x-1">{children}</div>
  </div>
)

const EditableTextarea = ({ className, html, disabled, onChange, onBlur }) => {
  return (
    <>
      <div className="flex flex-wrap gap-1">
        <GroupButtons name="Стиль">
          <Button cmd="italic" icon={faItalic} />
          <Button cmd="bold" icon={faBold} />
          <Button cmd="underline" icon={faUnderline} />
          <Button cmd="strikeThrough" icon={faStrikethrough} />
          {/* <Button cmd="subscript" icon={faSubscript} />
          <Button cmd="superscript" icon={faSuperscript} /> */}
          {/* <Button cmd="removeFormat" icon={faBan} /> */}
        </GroupButtons>
        <GroupButtons name="Размер">
          <Button
            cmd="fontSize"
            icon={faFont}
            arg="2"
            iconClassName="w-2 h-2"
          />
          <Button
            cmd="fontSize"
            icon={faFont}
            arg="3"
            iconClassName="w-2.5 h-2.5"
          />
          <Button
            cmd="fontSize"
            icon={faFont}
            arg="4"
            iconClassName="w-3 h-3"
          />
          <Button
            cmd="fontSize"
            icon={faFont}
            arg="5"
            iconClassName="w-3.5 h-3.5"
          />
          <Button
            cmd="fontSize"
            icon={faFont}
            arg="6"
            iconClassName="w-4 h-4"
          />
          <Button
            cmd="fontSize"
            icon={faFont}
            arg="7"
            iconClassName="w-5 h-5"
          />
        </GroupButtons>
        <GroupButtons name="Выравнивание">
          <Button cmd="justifyLeft" icon={faAlignLeft} />
          <Button cmd="justifyCenter" icon={faAlignCenter} />
          <Button cmd="justifyRight" icon={faAlignRight} />
          <Button cmd="justifyFull" icon={faAlignJustify} />
        </GroupButtons>
        {/* <GroupButtons name="Список">
          <Button cmd="superscript" icon={faAlignLeft} />
        </GroupButtons> */}
      </div>
      <ContentEditable
        className={className}
        html={html}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
      />
    </>
  )
}

export default EditableTextarea
