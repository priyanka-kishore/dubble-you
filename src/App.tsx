import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './context/ThemeContext'
import Home from './pages/Home'
import PersonaDetail from './pages/PersonaDetail'
import Timer from './pages/Timer'

function ThemedRoot() {
  const { palette } = useTheme()

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: palette.bg,
        color: palette.textPrimary,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/persona/:id" element={<PersonaDetail />} />
        <Route path="/timer/:id" element={<Timer />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <ThemedRoot />
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
