import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment.prod'; // ✅ Importa environment

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private hubConnection!: signalR.HubConnection;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/notificacionesHub`, { withCredentials: true }) // 🔹 usa environment
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ Conectado al Hub de notificaciones'))
      .catch(err => console.error('❌ Error al conectar al Hub:', err));
  }

  onVentaPagada(callback: (data: any) => void) {
    this.hubConnection.on('VentaPagada', callback);
  }
}

/*
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private hubConnection!: signalR.HubConnection;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
  .withUrl('https://localhost:7046/notificacionesHub', { withCredentials: true }) // 🔹 importante
  .build();

    this.hubConnection.start().catch(err => console.error(err));
  }

  onVentaPagada(callback: (data: any) => void) {
    this.hubConnection.on('VentaPagada', callback);
  }
}
*/