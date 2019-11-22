import { Order } from './../interfaces/order';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private db: AngularFirestore) {
    this.orderRef = db.collection<Order>('orders', ref => {
      return ref.where('completed', '==', 0).orderBy('orderDateTime', 'asc');
      // return ref.where('status', '==', 'completed').orderBy('orderDateTime', 'desc');
    });
  }
  orderRef: AngularFirestoreCollection<Order>;
  orders: Observable<any[]>;
  waitingBackend = true;
  subScription: Subscription;
  time: Date;

  async ngOnInit() {
    console.log('Processing ..');
    this.orders = await this.orderRef.snapshotChanges().pipe(map(change => {
      return change.map(a => {
        const orders = a.payload.doc.data() as Order;
        orders['id'] = a.payload.doc.id;
        orders['food'] = a.payload.doc.data().food.filter(b => b.kitchen.toUpperCase() === 'FOOD');
        this.waitingBackend = false;
        return orders;
      });
    }));
    console.log(this.orders);
  }

}
