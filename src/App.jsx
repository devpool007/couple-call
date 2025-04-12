import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="mb-8">
        <div className="flex space-x-4">
          <a href="https://vite.dev" target="_blank" className="hover:opacity-80">
            <img src={viteLogo} className="w-16 h-16" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="hover:opacity-80">
            <img src={reactLogo} className="w-16 h-16" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mt-4">Vite + React</h1>
      </header>
      <main className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <button
            onClick={() => setCount((count) => count + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Count is {count}
          </button>
          <p className="mt-4 text-gray-600">
            Edit <code className="bg-gray-200 px-1 rounded">src/App.jsx</code> and save to test HMR
          </p>
        </div>
      </main>
      <footer className="mt-8 text-gray-500">
        <p>
          Click on the Vite and React logos to learn more
        </p>
      </footer>
    </div>
  )
}

export default App
