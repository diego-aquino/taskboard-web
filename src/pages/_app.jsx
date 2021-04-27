import '~/styles/global.scss';
import { AccountContextProvider } from '~/contexts/AccountContext';
import { AuthContextProvider } from '~/contexts/AuthContext';

const App = ({ Component, pageProps }) => (
  <AuthContextProvider>
    <AccountContextProvider>
      <Component {...pageProps} />
    </AccountContextProvider>
  </AuthContextProvider>
);

export default App;
