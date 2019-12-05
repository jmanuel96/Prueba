import { Component, OnInit } from '@angular/core';
import { Becoven } from '../becoven';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit {
  
  document: any = {
    id: "",
    data: {} as Becoven
  };

  nuevo = false;
  id = null;
  idBecovenSelec: string;
  becovenEditando: Becoven;
  arrayColeccionBecoven: any[];
  

  constructor(
    private firestoreService:FirestoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { 
      
    
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("productos", this.id).then(() => {
      // Actualizar la lista completa
      console.log('Producto borrado correctamente!');
      this.obtenerListaBecoven();
      // Limpiar datos de pantalla
      this.router.navigate(["/home/"]);
    })
  }
  

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    if (this.id == 'nuevo'){
      this.nuevo = true;
    }else{
      this.nuevo = false;
    
    this.firestoreService.consultarPorId("productos", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.id);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Becoven;
      } 
    });
  }
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("productos", this.id, this.document.data).then(() => {
      console.log( 'Producto modificado correctamente!');
      this.obtenerListaBecoven();
      this.document.data = {} as Becoven;
      this.router.navigate(["/home/"]);
    })
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

  clicBotonInsertar() {
    this.firestoreService.insertar("productos", this.document.data).then(() => {
      console.log('Producto creado correctamente!');
      this.becovenEditando= {} as Becoven;
      this.router.navigate(["/home/"]);
    }, (error) => {
      console.error(error);
    });
  }

  navigateToHome(becovenSelec){
    this.router.navigate(["/home/"]);
  }






}
