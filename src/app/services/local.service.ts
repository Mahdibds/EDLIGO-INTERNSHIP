import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalService {

    modifyattempt(user){

        let result ={};
        var attempt = localStorage.getItem('attempt');

        var arrange=null;
        if(!attempt){
            arrange = new Array();    
        } else {
            arrange = JSON.parse(attempt);
        }
        
        let iUsu = arrange.find( item=> item.user == user);

        if(iUsu){
            iUsu.attempt = iUsu.attempt+1;
            result =iUsu;
        } else {
            let aux ={
                "user": user,
                "attempt": 1 
            }
            arrange.push(aux);
            result =aux;
        }
        localStorage.setItem('attempt', JSON.stringify(arrange));
        return result;
    }

    deleteuser(user){
        var attempt = localStorage.getItem('attempt');
        var arrange = JSON.parse(attempt);
        let iUsu = arrange.find( item=> item.user == user);
        if(iUsu){
            iUsu.attempt =0;
        }
        localStorage.setItem('attempt', JSON.stringify(arrange));
    }

}
