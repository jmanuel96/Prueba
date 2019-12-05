import { Component } from '@angular/core';

import { FirestoreService } from '../firestore.service';
import { Becoven } from '../becoven';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  becovenEditando: Becoven;

  arrayColeccionBecoven: any = [{
    id: "",
    data: {} as Becoven
   }];
   idBecovenSelect: string;

  constructor(private firestoreService: FirestoreService,private router: Router) {
    // Crear un becoven vacío
    this.becovenEditando = {} as Becoven;
    this.obtenerListaBecoven();
  }


  clicBotonInsertar() {
    this.firestoreService.insertar("productos", this.becovenEditando).then(() => {
      console.log('Producto creado correctamente!');
      this.becovenEditando= {} as Becoven;
    }, (error) => {
      console.error(error);
    });
  }
  obtenerListaBecoven(){
    this.firestoreService.consultar("productos").subscribe((resultadoConsultaBecoven) => {
      this.arrayColeccionBecoven = [];
      resultadoConsultaBecoven.forEach((datosBecoven: any) => {
        this.arrayColeccionBecoven.push({
          id: datosBecoven.payload.doc.id,
          data: datosBecoven.payload.doc.data()
        });
      })
    });
  }

  idBecovenSelec: string;

  selecBecoven(becovenSelec) {
    console.log("Producto seleccionado: ");
    console.log(becovenSelec);
    this.idBecovenSelec = becovenSelec.id;
    this.becovenEditando.titulo = becovenSelec.data.titulo;
    this.becovenEditando.descripcion = becovenSelec.data.descripcion;
    this.becovenEditando.precio = becovenSelec.data.precio;
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("productos", this.idBecovenSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaBecoven();
      // Limpiar datos de pantalla
      this.becovenEditando = {} as Becoven;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("productos", this.idBecovenSelec, this.becovenEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaBecoven();
      // Limpiar datos de pantalla
      this.becovenEditando = {} as Becoven;
    })
  }

  navigateToProducto(becovenSelec) {
    // this.router.navigate(["/producto" + this.idBecovenSelec]);
    this.router.navigate(["/form/" + becovenSelec.id]);
    //
  }

  insertarProductoNuevo(nuevo){
    this.router.navigate(["/form/" + nuevo]);
  }
  

}
