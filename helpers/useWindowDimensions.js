import { useState, useEffect } from 'react'

function getWindowDimensions() {
  if (typeof window !== 'undefined') {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height,
    }
  } else {
    return { width: 0, height: 0 }
  }
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  )

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowDimensions
}

export const useWindowDimensionsTailwind = () => {
  const { width } = useWindowDimensions()
  if (width < 420) return 1 //'phoneV'
  if (width < 620) return 2 //'phoneH'
  if (width < 940) return 3 //'tablet'
  if (width < 1120) return 4 //'laptop'
  return 5 //'desktop'
}
