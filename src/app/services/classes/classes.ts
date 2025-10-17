import { inject, Injectable, signal } from '@angular/core';
import { collectionData, docData, Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, query, updateDoc, where } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { ClassData, STATUS } from '../../admin/classes/class.model';

@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  COLLECTION_NAME = 'classes';
  private firestore = inject(Firestore);

  classes = signal<ClassData[]>(this.loadClasses());

  getClasses(): Observable<ClassData[]> {
    const queryRef = query(
      collection(this.firestore, this.COLLECTION_NAME),
      where('status', '!=', STATUS.deleted)
    );
    return collectionData(queryRef, { idField: 'id' }) as Observable<ClassData[]>;
  }

  getClassById(id: string): Observable<ClassData | undefined> {
    const docRef = doc(this.firestore, this.COLLECTION_NAME, id);
    return docData(docRef, { idField: 'id' }) as Observable<ClassData | undefined>;
  }

  addClass(classData: ClassData) {
    return from(
      addDoc(collection(this.firestore, this.COLLECTION_NAME), {
        ...classData,
        status: STATUS.active,
      })
    );
  }

  updateClass(id: string, classData: Partial<ClassData>) {
    return from(updateDoc(doc(this.firestore, this.COLLECTION_NAME, id), classData));
  }

  deleteClass(id: string) {
    return from(
      updateDoc(doc(this.firestore, this.COLLECTION_NAME, id), { status: STATUS.deleted })
    );
  }

  setClasses(classes: ClassData[]) {
    this.classes.set(classes);
    localStorage.setItem('classes', JSON.stringify(classes));
  }

  loadClasses() {
    const classes = localStorage.getItem('classes');
    return classes ? JSON.parse(classes) : [];
  }
}
