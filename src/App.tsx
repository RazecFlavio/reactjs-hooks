import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/themes/default";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { CyclesContextProvider } from "./contexts/CyclesContext";

function App() {
    return (
        <div>
            <ThemeProvider theme={defaultTheme}>
                <BrowserRouter>
                    <CyclesContextProvider>
                        <Router />
                    </CyclesContextProvider>
                </BrowserRouter>
                <GlobalStyle />
            </ThemeProvider>
        </div>
    );
}

export default App;
