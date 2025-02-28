"use client"

import React from "react"
import { Navigation } from "./components/Navigation" // Importing the Navigation component

// Home is the landing page component for the application
export default function Home() {
  return (
    <div>
      {/* Render the Navigation component at the top of the page */}
      <Navigation />
      <main>
        <h1>Welcome to Cursordevkit Homepage</h1>
        <p>This is the landing page of the project. Explore the navigation above to explore different sections.</p>
      </main>
    </div>
  )
} 