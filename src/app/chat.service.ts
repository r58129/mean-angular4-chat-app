import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

// let httpOptions = {
//   headers: new Headers({
//     // 'Content-Type':  'multipart/form-data'
//     'Content-Type':  'application/form-data'
//     'Content-Type':  'undefined'
//     // 'Content-Type':  'application/json'
//     //  'Content-Type':'application/x-www-form-urlencoded'
//     //'Authorization': 'my-auth-token'
//   })
// };

@Injectable()
export class ChatService {

  constructor(private http : Http) { }

    private serverUrl = 'https://airpoint.com.hk:3088';
    // private serverUrl = 'https://192.168.0.102:4060';
    
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
        this.http.get(this.serverUrl+'/chat/request' + id)
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
      this.http.get(this.serverUrl+'/chat/user/all')
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
        this.http.get(this.serverUrl+'/chat/user' + id)
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
        this.http.post(this.serverUrl+'/chat/user', data)
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
        this.http.put(this.serverUrl+'/chat/user'+id, data)
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
        this.http.delete(this.serverUrl+'/chat/user/'+id)
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
      this.http.get(this.serverUrl+'/chat/image/all')
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  //get image by room
  getImageByRoom(room) {    //here we use room as phone_number
    return new Promise((resolve, reject) => {
      this.http.get(this.serverUrl+'/chat/image' + room)
        .map(res => res.json())
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

// Show signle image by ID
  showImage(id) {
    return new Promise((resolve, reject) => {
        this.http.get(this.serverUrl+'/chat/image' + id)
          .map(res => res.json())
          .subscribe(res => {
            resolve(res)
        }, (err) => {
          reject(err);
        });
    });
  }

// Save image to DB
  saveImage(object) {
    return new Promise((resolve, reject) => {
        this.http.post(this.serverUrl+'/chat/image', object)
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
        this.http.delete(this.serverUrl+'/chat/image/'+id)
          .subscribe(res => {
            resolve(res);
          }, (err) => {
            reject(err);
          });
    });
  }

  //post formdata image to tinker
  postImage2Node(formdata) {
    return new Promise((resolve, reject) => {
      console.log("formdata: " +formdata);
      console.log("formdata.sessionID: " +formdata.sessionID);
      console.log("formdata.imagefilename: " +formdata.imagefilename);

      // this.http.post('https://192.168.0.157:8011/api/csp/postimage', formdata, httpOptions )
//      this.http.post('https://192.168.0.156:8011/api/csp/postimage', formdata )
//          // .map(res => res.json())
//          .subscribe(res => {
//            resolve(res);
//            console.log("post successful");
//          }, (err) => {
//            reject(err);
//            console.log("post failed");
//          });
    });
  }


  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
