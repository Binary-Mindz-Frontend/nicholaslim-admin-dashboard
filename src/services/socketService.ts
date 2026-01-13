import { io, Socket } from 'socket.io-client';

class SocketService {
  private riderSocket: Socket | null = null;
  private adminSocket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // Rider Socket Methods
  connectRider(token: string) {
    if (this.riderSocket && this.riderSocket.connected) {
      return this.riderSocket;
    }

    this.riderSocket = io('http://localhost:3000/raider', {
      auth: { token },
      autoConnect: false
    });

    return this.riderSocket;
  }

  disconnectRider() {
    if (this.riderSocket) {
      this.riderSocket.disconnect();
      this.riderSocket = null;
    }
  }

  sendRiderLocation(lat: number, lng: number, heading: number) {
    if (this.riderSocket && this.riderSocket.connected) {
      this.riderSocket.emit('rider:location', { lat, lng, heading });
    }
  }

  // Admin Socket Methods
  connectAdmin(token: string) {
    if (this.adminSocket && this.adminSocket.connected) {
      return this.adminSocket;
    }

    this.adminSocket = io('http://localhost:3000/admin', {
      auth: { token },
      autoConnect: false
    });

    return this.adminSocket;
  }

  disconnectAdmin() {
    if (this.adminSocket) {
      this.adminSocket.disconnect();
      this.adminSocket = null;
    }
  }

  refreshOrders() {
    if (this.adminSocket && this.adminSocket.connected) {
      this.adminSocket.emit('admin:refresh_orders');
    }
  }

  // Getters
  getRiderSocket() {
    return this.riderSocket;
  }

  getAdminSocket() {
    return this.adminSocket;
  }

  // Cleanup
  cleanup() {
    this.disconnectRider();
    this.disconnectAdmin();
  }
}

export default SocketService.getInstance();