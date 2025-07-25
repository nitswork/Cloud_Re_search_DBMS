import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function Home () {
  return (
    <div>
      <Sidebar />
      <Header />

      <main className='ml-[260px] h-[calc(100vh - 60px)] overflow-y-scroll  p-4'>
        <h1 className='text-2xl'>Welcome to the Home Page</h1>
      </main>
    </div>
  )
}