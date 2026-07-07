// // components/ErrorBoundary.jsx
// import React from 'react'

// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = { hasError: false, error: null }
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error }
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('Error caught by boundary:', error, errorInfo)
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
//           <div className="text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
//             Something went wrong
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
//             {this.state.error?.message || 'An unexpected error occurred'}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Reload Page
//           </button>
//         </div>
//       )
//     }

//     return this.props.children
//   }
// }

// export default ErrorBoundary