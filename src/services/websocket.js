    class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.connectionStatus = 'disconnected';
    this.connectionPromise = null;
  }

  connect() {
    // If already connecting or connected, return existing promise
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:5000';
    
    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        this.connectionStatus = 'connecting';
        console.log(`Attempting to connect to WebSocket at ${wsUrl}...`);
        
        // Add a small delay to ensure server is ready
        setTimeout(() => {
          this.ws = new WebSocket(wsUrl);
        
          // Set a timeout for connection
          const connectionTimeout = setTimeout(() => {
            if (this.ws && this.ws.readyState === WebSocket.CONNECTING) {
              this.ws.close();
              this.connectionStatus = 'failed';
              reject(new Error('WebSocket connection timeout'));
              this.handleReconnect();
            }
          }, 5000);
          
          this.ws.onopen = () => {
            clearTimeout(connectionTimeout);
            console.log('Connected to WebSocket server');
            this.connectionStatus = 'connected';
            this.reconnectAttempts = 0;
            resolve();
          };
          
          this.ws.onmessage = (event) => {
            try {
              const message = JSON.parse(event.data);
              this.handleMessage(message);
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          };
          
          this.ws.onclose = (event) => {
            clearTimeout(connectionTimeout);
            console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
            this.connectionStatus = 'disconnected';
            this.connectionPromise = null;
            
            // Only attempt to reconnect if it wasn't a normal closure
            if (event.code !== 1000) {
              this.handleReconnect();
            }
          };
          
          this.ws.onerror = (error) => {
            clearTimeout(connectionTimeout);
            console.error('WebSocket error:', error);
            this.connectionStatus = 'failed';
            this.connectionPromise = null;
            reject(error);
          };
        }, 1000); // 1 second delay
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        this.connectionStatus = 'failed';
        this.connectionPromise = null;
        reject(error);
        this.handleReconnect();
      }
    });
    
    return this.connectionPromise;
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connectionPromise = null; // Reset the connection promise
        this.connect().catch(error => {
          console.error('Reconnection failed:', error);
        });
      }, this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.connectionStatus = 'failed';
    }
  }

  handleMessage(message) {
    const { type, data } = message;
    
    if (this.listeners[type]) {
      this.listeners[type].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${type}:`, error);
        }
      });
    }
  }

  subscribe(eventType, callback) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    this.listeners[eventType].push(callback);
    
    // Return unsubscribe function
    return () => {
      if (this.listeners[eventType]) {
        this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners = {};
  }

  send(message) {
    if (this.connectionStatus !== 'connected' || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected. Message not sent:', message);
      return false;
    }
    
    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService();

export default websocketService;