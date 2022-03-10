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
import cn from 'classnames'
import { useState } from 'react'
import ContentEditable from 'react-contenteditable'
import { useEffect } from 'react/cjs/react.development'
import { Divider, LoadingSpinner } from '.'
import Button from './Button'

const TextareaButton = ({
  icon,
  cmd,
  arg,
  iconClassName,
  disabled = false,
}) => (
  <button
    className={
      'flex items-center justify-center w-6 h-6 p-1 text-black duration-200 border border-gray-400 rounded max-h-8 max-w-8 hover:text-general'
    }
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

const EditableTextarea = ({
  className,
  html = '',
  disabled,
  onChange,
  onBlur,
  readonly = true,
  placeholder,
  onSave,
  uncontrolled = true,
  btnSaveName = 'Сохранить',
  disableUndo = false,
  title = 'nerker',
}) => {
  const [textHtml, setTextHtml] = useState(html)
  const [isSaveProcess, setIsSaveProcess] = useState(false)

  const saveTask = async () => {
    if (onSave) {
      uncontrolled && setIsSaveProcess(true)
      await onSave(textHtml)
    }
  }

  useEffect(() => {
    if (uncontrolled && isSaveProcess && html === textHtml)
      setIsSaveProcess(false)
    if (html !== textHtml) setTextHtml(html)
  }, [html])

  return (
    <div>
      {readonly ? (
        <div>
          {title && <div className="font-bold">{title}</div>}
          <div
            dangerouslySetInnerHTML={{
              __html: textHtml,
            }}
          />
        </div>
      ) : (
        <div className="p-2 bg-white border border-gray-300">
          <div className="flex flex-wrap gap-1">
            <GroupButtons name="Стиль">
              <TextareaButton cmd="italic" icon={faItalic} />
              <TextareaButton cmd="bold" icon={faBold} />
              <TextareaButton cmd="underline" icon={faUnderline} />
              <TextareaButton cmd="strikeThrough" icon={faStrikethrough} />
              {/* <Button cmd="subscript" icon={faSubscript} />
          <Button cmd="superscript" icon={faSuperscript} /> */}
              {/* <Button cmd="removeFormat" icon={faBan} /> */}
            </GroupButtons>
            <GroupButtons name="Размер">
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="2"
                iconClassName="w-2 h-2"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="3"
                iconClassName="w-2.5 h-2.5"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="4"
                iconClassName="w-3 h-3"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="5"
                iconClassName="w-3.5 h-3.5"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="6"
                iconClassName="w-4 h-4"
              />
              <TextareaButton
                cmd="fontSize"
                icon={faFont}
                arg="7"
                iconClassName="w-5 h-5"
              />
            </GroupButtons>
            <GroupButtons name="Выравнивание">
              <TextareaButton cmd="justifyLeft" icon={faAlignLeft} />
              <TextareaButton cmd="justifyCenter" icon={faAlignCenter} />
              <TextareaButton cmd="justifyRight" icon={faAlignRight} />
              <TextareaButton cmd="justifyFull" icon={faAlignJustify} />
            </GroupButtons>
            {/* <GroupButtons name="Список">
          <Button cmd="superscript" icon={faAlignLeft} />
        </GroupButtons> */}
          </div>
          <Divider thin light />
          <ContentEditable
            className={cn('outline-none my-2', className)}
            html={uncontrolled ? textHtml : html}
            disabled={disabled}
            // onChange={onChange}
            onChange={(e) => {
              if (uncontrolled) setTextHtml(e.target.value)
              else onChange && onChange()
            }}
            onBlur={onBlur}
            placeholder={placeholder}
          />
          <Divider thin light />
          <div className="flex justify-between py-1">
            {(!uncontrolled || !isSaveProcess) && (
              <>
                {!disableUndo && (
                  <Button
                    onClick={() => setTextHtml(html)}
                    classBgColor="bg-gray-700"
                    name="Отменить изменения"
                    disabled={html === textHtml}
                  />
                )}
                {onSave && (
                  <div className="flex justify-end flex-1">
                    <Button
                      onClick={saveTask}
                      classBgColor="bg-blue-700"
                      name={btnSaveName}
                      disabled={html === textHtml}
                    />
                  </div>
                )}
              </>
            )}
            {uncontrolled && isSaveProcess && (
              <div className="flex items-center gap-2">
                <span>Сохранение...</span>
                <LoadingSpinner size="xs" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EditableTextarea
