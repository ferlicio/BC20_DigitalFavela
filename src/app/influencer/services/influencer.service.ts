import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { collectionData } from '@angular/fire/firestore';
import { collection, Firestore, Query, query, QueryConstraint, where, } from 'firebase/firestore';
import { from, map, mergeMap, Observable } from 'rxjs';
import { FirestoreQuery } from 'src/app/models/firestore-query';
import { Influencer } from 'src/app/influencer/models/influencer';
import { convertSnaps, convertSnapsW } from 'src/app/utils';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InfluencerService {
  constructor(private db: AngularFirestore, private https: HttpClient) { }
  createInfluencer(influencer: Influencer, uid: string): Observable<any> {
    return from(this.db.collection('influencers').doc(uid).set(influencer))
  }
  checkValidEmailAndCPF(cpf: string, email: string) {
    return this.https.post('https://us-central1-api-test-9fbf3.cloudfunctions.net/influencer/verifier', { cpf, email })
  }

  deleteSocialNetwork(uid: string, socialNetwork: string) {
    return this.https.post('https://us-central1-api-test-9fbf3.cloudfunctions.net/influencer/delete', { uid, socialNetwork })
  }

  getCompletedRegister() {
    return this.db.collection('influencers', ref => ref.where('cadastroFinalizado', '==', true)).get()
      .pipe(mergeMap(result => {
        const influencer = convertSnaps<Influencer>(result)
        return influencer;
      }))
  }

  getInfluencers() {
    return this.db.collection('influencers').get().pipe(
      map(result => convertSnaps<Influencer>(result))
    )
  }

  getInfluencer(uid: string) {
    return this.db.collection('influencers').doc(uid).valueChanges({ idField: 'id' }).pipe(
      map(result => { return result as Influencer }))
  }

  getInfluencersStatusCompleted() {
    return this.db.collection('influencers', ref =>
      ref.where('cadastroFinalizado', '==', "true")).get()
      .pipe(map(result => {
        return convertSnaps<Influencer>(result)
      }
      ))
  }
  dinamicQuery(queryList: FirestoreQuery[]) {
    const queryConditions: QueryConstraint[] = queryList.map(condition =>
      where(condition.property, condition.operator, condition.value))
    const queryToPerform: Query<any> = query(collection(this.db.firestore, 'influencers'), ...queryConditions)
    return collectionData(queryToPerform, { idField: 'id' }).pipe(map(x => {
      return convertSnapsW<Influencer>(x)
    }))
  }
}


