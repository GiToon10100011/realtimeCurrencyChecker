'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { WebSocketMessage } from '@/types'

interface UseWebSocketOptions {
  url: string
  onMessage: (message: WebSocketMessage) => void
}

interface UseWebSocketReturn {
  isConnected: boolean
  error: string | null
  updateThreshold: ((threshold: number) => void) | null
}

export function useWebSocket({ url, onMessage }: UseWebSocketOptions): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const updateThreshold = useCallback((threshold: number) => {
    if (socketRef.current) {
      socketRef.current.emit('updateThreshold', { threshold })
    }
  }, [])

  useEffect(() => {
    const socket = io(url)
    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('error', (err) => {
      setError(err.message || 'WebSocket connection error')
    })

    socket.on('exchangeRateUpdate', (message: WebSocketMessage) => {
      onMessage(message)
    })

    socket.on('connectionStatus', (message: WebSocketMessage) => {
      onMessage(message)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [url, onMessage])

  return {
    isConnected,
    error,
    updateThreshold: isConnected ? updateThreshold : null
  }
}