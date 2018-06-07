import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ChatService {

  constructor(private http : Http) { }

    // private serverUrl = 'https://airpoint.com.hk:3088';
    private serverUrl = 'https://192.168.0.102:4060';
    
  getChatByRoom(room) {    //here we use room as phone_number
    return new Promise((resolve, reject) => {
      this.http.get(this.serverUrl+'/chat/' + room)
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
        this.http.get(this.serverUrl+'/chat/' + id)
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
        this.http.post(this.serverUrl+'/chat', data)
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
        this.http.put(this.serverUrl+'/chat/'+id, data)
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
        this.http.delete(this.serverUrl+'/chat/'+id)
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
      this.http.get(this.serverUrl+'/chat/request/human' )
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
      this.http.get(this.serverUrl+'/chat/request/' + room)
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
        this.http.get(this.serverUrl+'/chat/request' + id)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }

   showRequestSocket(id) {
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
        this.http.post(this.serverUrl+'/chat/request', data)
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
        this.http.put(this.serverUrl+'/chat/request'+id, data)
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
        this.http.delete(this.serverUrl+'/chat/request/'+id)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  //get all users

  getAllUser() {
    return new Promise((resolve, reject) => {
      this.http.get('/chat/user/all')
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  showUser(id) {
    return new Promise((resolve, reject) => {
        this.http.get('/chat/user' + id)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }



  saveUser(data) {
    return new Promise((resolve, reject) => {
        this.http.post('/chat/user', data)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  updateUser(id, data) {
    return new Promise((resolve, reject) => {
        this.http.put('/chat/user'+id, data)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
        this.http.delete('/chat/user/'+id)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

    //get all images

  getAllImage() {
    return new Promise((resolve, reject) => {
      this.http.get('/chat/image/all')
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }


  showImage(id) {
    return new Promise((resolve, reject) => {
        this.http.get('/chat/image' + id)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }

// Save to DB
  saveImage(data) {
    return new Promise((resolve, reject) => {
        this.http.post('/chat/image', data)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  deleteImage(id) {
    return new Promise((resolve, reject) => {
        this.http.delete('/chat/image/'+id)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  //post to tinker
  postImage2Node(data) {
    return new Promise((resolve, reject) => {
        this.http.post('https://192.168.0.157:8011/api/csp/postimage', data)
          .map(res => res.json())
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
