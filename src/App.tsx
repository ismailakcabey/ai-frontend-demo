import './App.css'
import Router from './routes/index.route'
import { QueryClient, QueryClientProvider } from 'react-query'

function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })
  return (
    <>
      <QueryClientProvider client={client}>
        <Router />
      </QueryClientProvider>
    </>
  )
}

export default App
