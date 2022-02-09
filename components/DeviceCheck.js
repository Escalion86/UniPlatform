function DeviceCheck({ className = null, textClassName = null }) {
  return (
    <div
      className={
        'flex items-center justify-center ' +
        (className
          ? className
          : 'fixed -left-7 z-50 h-10 text-sm leading-3 w-24 top-20 bg-primary rounded-t-md transform rotate-90')
      }
    >
      <div
        className={
          (textClassName ? textClassName : '') +
          ' text-center hidden phoneV:block phoneH:hidden'
        }
      >
        Телефон вертикаль
      </div>
      <div
        className={
          (textClassName ? textClassName : '') +
          ' text-center hidden phoneH:block tablet:hidden'
        }
      >
        Телефон горизонт
      </div>
      <div
        className={
          (textClassName ? textClassName : '') +
          ' text-center hidden tablet:block laptop:hidden'
        }
      >
        Планшет
      </div>
      <div
        className={
          (textClassName ? textClassName : '') +
          ' text-center hidden laptop:block desktop:hidden'
        }
      >
        Ноутбук
      </div>
      <div
        className={
          (textClassName ? textClassName : '') +
          ' text-center hidden desktop:block'
        }
      >
        Компьютер
      </div>
    </div>
  )
}

export default DeviceCheck
