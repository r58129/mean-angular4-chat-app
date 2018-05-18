import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {

  constructor(private http: Http) { }

  getChatByRoom(room) {
    return new Promise((resolve, reject) => {
      this.http.get('/chat/' + room)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  showChat(id) {
    return new Promise((resolve, reject) => {
        this.http.get('/chat/' + id)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }

  saveChat(data) {
    return new Promise((resolve, reject) => {
        this.http.post('/chat', data)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  updateChat(id, data) {
    return new Promise((resolve, reject) => {
        this.http.put('/chat/'+id, data)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  deleteChat(id) {
    return new Promise((resolve, reject) => {
        this.http.delete('/chat/'+id)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

 // get all human Request
  getAllRequest(human) {
    return new Promise((resolve, reject) => {
      this.http.get('/chat/request/human' )
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  // Request, room refer to phone number
  getRequestByRoom(room) {
    return new Promise((resolve, reject) => {
      this.http.get('/chat/request/' + room)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  showRequest(id) {
    return new Promise((resolve, reject) => {
        this.http.get('/chat/request' + id)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }

  saveRequest(data) {
    return new Promise((resolve, reject) => {
        this.http.post('/chat/request', data)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  updateRequest(id, data) {
    return new Promise((resolve, reject) => {
        this.http.put('/chat/request'+id, data)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  deleteRequest(id) {
    return new Promise((resolve, reject) => {
        this.http.delete('/chat/request/'+id)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
