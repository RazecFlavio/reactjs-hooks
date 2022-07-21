import { ThemeProvider } from 'styled-components'
import { Button } from './components/Button'
import { GlobalStyle } from './styles/global'
import { defaultTheme } from './styles/themes/default'

function App() {
  return (
    <div>
      <ThemeProvider theme={defaultTheme}>
        <Button variant="primary" />
        <Button variant="secondary" />
        <Button variant="success" />
        <Button variant="danger" />
        <Button />

        <GlobalStyle />
      </ThemeProvider>
    </div>
  )
}

export default App
