import { MODES, MODES_NAMES } from '@helpers/constants'
import ComboBox from './ComboBox'

const ComboBoxRoles = ({ value, onChange, disabled, labelClassName }) => {
  const items = Object.values(MODES).map((role) => {
    return {
      value: role,
      name: MODES_NAMES[role],
    }
  })

  return (
    <ComboBox
      labelClassName={labelClassName}
      defaultValue={value}
      title="Роль"
      items={items}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

export default ComboBoxRoles
