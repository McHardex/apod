import getFirestore from 'firebaseSetup';
import { Picture } from 'types';

const FAVORITE_PICTURES_COLLECTION = 'favoritePictures';

const favoritesCollection = () => getFirestore().collection(FAVORITE_PICTURES_COLLECTION);

const firebaseService = {
  async get() {
    const favoritePictures: Picture[] = [];
    const snapshot = await favoritesCollection().get();
    snapshot.forEach((doc) => {
      const data = doc.data() as Picture;
      favoritePictures.push({ ...data, id: doc.id });
    });
    return favoritePictures;
  },

  create(picture: Picture) {
    return favoritesCollection().add(picture);
  },

  async delete(id: string) {
    return await favoritesCollection().doc(id).delete();
  },

  async deleteCollection() {
    const batch = getFirestore().batch();
    const snapshot = await favoritesCollection().get();
    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  }
};

export default firebaseService;
