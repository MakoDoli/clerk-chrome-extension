import "./App.css";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  ClerkProvider,
  SignOutButton,
  useUser,
} from "@clerk/chrome-extension";
import { useNavigate, Routes, Route, MemoryRouter } from "react-router-dom";
import Chat from "./components/Chat";

function HelloUser() {
  const { user } = useUser();
  const email = user?.emailAddresses[0].emailAddress;
  const index = email?.indexOf("@");
  const name = email?.substring(0, index);
  console.log(name);
  return (
    <div>
      <p> Hello {name}</p>
      <Chat />
    </div>
  );
}

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route path="/sign-up/*" element={<SignUp signInUrl="/" />} />
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <HelloUser />
                <SignOutButton />
              </SignedIn>
              <SignedOut>
                <SignIn afterSignInUrl="/" signUpUrl="/sign-up" />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return (
    <MemoryRouter>
      <ClerkProviderWithRoutes />
    </MemoryRouter>
  );
}

export default App;
