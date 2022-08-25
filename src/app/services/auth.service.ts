import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    ApiUrl: string;
    isLogin = false;
    roleAs: string;

    constructor(protected http: HttpClient){
        this.ApiUrl = environment.api;
    }

    registeruser( user ): Observable<any>{
        let root = [this.ApiUrl, 'registred'].join('/');
        return this.http.post(root, user);
    }

    login( username: string , password: string){

        return new Promise(async (resolve, reject)=>{

            try {
                let root = [this.ApiUrl, "login"].join('/');
                let result =await this.http.post(root,{'username': username, 'password': password}).toPromise();  
                if(result){
                   console.log(result);
                   localStorage.setItem("PROFILE", result["profile"]);
                   localStorage.setItem("TOKEN", result["token"]);
                   this.isLogin= true;
                } 
                resolve({"isLogin": this.isLogin, "screen":result["screen_initiation"]}); 
            } catch (error) {
               reject(error);
            }

        })

    }


    validatelock(datos): Observable<any>{
        let root = [this.ApiUrl, 'validatelock'].join('/');
        return this.http.post(root, datos);
    }

    getRole(){
        return localStorage.getItem("PROFILE");
    }

    isLoggedIn(){
        let token = localStorage.getItem("TOKEN");
        if(token){
            return true;
        }
        return false;
    }

    Userinfo():Observable<any>{
        let token = localStorage.getItem("TOKEN");
        let root = [this.ApiUrl, 'dar-info-user'].join('/');
        return this.http.post(root, {"token":token});
    }

    Signoff(){
        localStorage.removeItem("PROFILE");
        localStorage.removeItem("TOKEN");
    }

    getprofiles():Observable<any>{
        let root = [this.ApiUrl, 'profile'].join('/');
        return this.http.get(root);
    }

    Updateuser (data, id_user):Observable<any>{
        let root = [this.ApiUrl, 'user', id_user].join('/');
        return this.http.put(root, {"id_profile": data.profile,"id_completed":data.completed});
    }

    Updatepassword ( password ): Observable<any>{
        let root = [this.ApiUrl, 'refresh'].join("/");
        return this.http.post(root, { "password":password, "token": localStorage.getItem("TOKEN") });
    }


}
